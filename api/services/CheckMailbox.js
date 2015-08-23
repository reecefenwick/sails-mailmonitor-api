/**
 * worker.js
 *
 * @description :: This is the worker for the mailbox - accepts a mailbox config and will connect and check health
 * @help        ::
 */

// Core Libraries
var Imap = require('imap');
var async = require('async');

var mailbox = {};
var imap = {};
var summary = {};

var getMailboxConfig = function(callback) {
    Mailbox.findOne({ _id: mailbox._id }, {}, function(err, doc) {
        if (err) return callback({
            step: 'getMailboxConfig',
            code: 500,
            info: 'There was an error calling the database',
            error: err
        });

        if (!doc) return callback({
            step: 'getMailboxConfig',
            code: 404,
            error: 'No mailbox found?!'
        });

        mailbox = doc;

        callback()
    })
};

var getEmails = function(callback) {
    // This can be simplified significantly once this pull request is merged - https://github.com/chirag04/mail-listener2/pull/40
    imap = new Imap({
        user: mailbox.props.username,
        password: mailbox.props.password,
        host: config.get('imap.host'),
        port: config.get('imap.port'),
        tls: config.get('imap.tls')
    });

    imap.once('ready', function() {
        imap.openBox(mailbox.props.folder, true, function(err, box) {
            if (err) return callback({
                step: 'getEmails',
                code: 'OPENFOLDER',
                info: 'Error opening folder ' + mailbox.props.folder,
                trace: console.trace()
            });

            summary.totalEmails = box.messages.total;

            logger.info('Opened %s folder, %s messages in total', mailbox.props.folder, summary.totalEmails);

            imap.search(["UNSEEN"], function (err, results) {
                if (err) return callback({
                    step: 'getEmails',
                    code: 'SEARCH',
                    info: 'Error searching mailbox',
                    error: err,
                    trace: console.trace()
                });

                callback(null, results)
            });
        })
    });

    imap.once('error', function(err) {
        // This is to get around some weird "bug"? - ECONNRESET means it was killed by the client
        if (err.code && err.code === 'ECONNRESET') return;

        callback({
            step: 'getEmails',
            code: 'IMAPERROR',
            info: 'There was an error with imap.',
            error: err,
            trace: console.trace()
        })
    });

    imap.once('end', function() {
        logger.info('Connection to mailbox %s ended', mailbox.name);
    });

    logger.info('Connecting to mailbox');
    imap.connect();
};

var parseEmails = function(results, callback) {
    logger.info('Parsing emails');
    var emails = [];

    async.each(results, function(result, done) {
        var fetch = imap.fetch(result, {
            bodies: '',
            markSeen: false
        });

        fetch.on('message', function(msg, seqno) {
            var email = {};

            msg.once('body', function(stream, info) {
                var buffer = '';

                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });

                stream.once('end', function() {
                    email = Imap.parseHeader(buffer);
                    emails.push(email);
                });
            });

            msg.once('end', function() {
                done()
            })
        });

        fetch.once('error', function(err) {
            console.log('Error fetching emails');
            done({
                step: 'parseEmails',
                code: 'FETCHERROR',
                info: 'Error fetching emails to be parsed.',
                error: err,
                trace: console.trace()
            });
        });
    }, function(err) {
        if (err) {
            return callback(err);
        }

        imap.end();

        callback(null, emails);
    })
};

var checkEmailHealth = function(emails, callback) {
    logger.info('Assessing email health');

    var health = {
        warning: 0,
        critical: 0
    };

    var results = mailbox.alerts;

    var timeNow = new Date();

    async.each(emails, function(email, done) {
        var received = new Date(email.date);

        var seconds = Math.round((timeNow-received)/1000);

        if (seconds > results.critical.threshold) {
            health.critical++;
            return done();
        }

        if (seconds > results.warning.threshold) {
            health.warning++;
            return done();
        }

        done();
    }, function(err){
        if (err) return callback({
            step: 'checkEmailHealth',
            code: 'CHECKEMAIL',
            info: 'Error checking email health',
            trace: console.trace()
        });
        summary.health = health;

        callback(null, health)
    });
};

var sendNotifications = function (health, callback) {
    var action = null;

    if (health.critical > 0 && Math.round((summary.startTime - mailbox.alerts.critical.lastCritical) / 1000) > 3600) {
        // Send a critical alert!
        action = 'CRITICAL'
    }

    if (health.warning > 0 && Math.round((summary.startTime - mailbox.alerts.warning.lastWarning) / 1000) > 1800) {
        if (!action) action = 'WARNING'
    }

    var emailContent = {
        from: 'reece.fenwick@suncorp.com.au'
    };

    if (action === 'CRITICAL') {
        emailContent.to = mailbox.alerts.critical.email; // Can we add SMS # in the TO or BCC?
        emailContent.subject = 'Mailbox Monitor - Critical Alert for mailbox' + mailbox.name;
        emailContent.message = '';

    }

    if (action === 'WARNING') {
        emailContent.to = mailbox.alerts.warning.email; // Can we add SMS # here?
        emailContent.subject = 'Mailbox Monitor - Warning for mailbox' + mailbox.name;
        emailContent.message = '';
    }

    if (!action) {
        summary.action = null;
        return callback();
    }

    Notify.sendEmail(emailContent, function (err) {
        if (err) return callback({
            step: 'sendNotifications',
            info: 'Error sending notifications',
            trace: console.trace()
        });

        var temp = action === 'CRITICAL' ? 'alerts.critical.lastCritical' : 'alerts.warning.lastWarning';

        var query = {_id: mailbox._id};

        // Bad global below
        var update = {};
        update[temp] = new Date();

        Mailbox.update(query, update, function (err) {
            if (err) return callback(err);

            console.log('run summary updated');
            callback();
        });
    })
};

var checkMailbox = function(_id, callback) {
    summary.mailbox = _id;
    summary.startTime = new Date();
    mailbox._id = _id;

    if(typeof callback === 'undefined') throw Error('No callback provided');

    logger.info('Starting mailbox health check %j', _id.toString());

    async.waterfall([
        getMailboxConfig,
        getEmails,
        parseEmails,
        checkEmailHealth,
        sendNotifications
    ], function (err) {
        summary.finishTime = new Date();
        summary.totalTime = Math.round((summary.finishTime - summary.startTime) / 1000);

        logger.info('Completed processing %s in %s seconds', mailbox.name, summary.totalTime);

        if (err) {
            logger.error(err);
            summary.error = err;
            callback(err);
        } else {
            callback();
        }

        // Store run summary

        var query = {_id: _id};
        var update = {
            $push: {
                history: summary
            }
        };

        Mailbox.update(query, update, function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
};

module.exports = checkMailbox;