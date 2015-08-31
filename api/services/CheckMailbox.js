/**
 * worker.js
 *
 * @description :: This is the worker for the mailbox - accepts a mailbox config and will connect and check health
 * @help        ::
 */

// Core Libraries
var MailListener = require('mail-listener3');
var async = require('async');
var _ = require('lodash');

var Notify = require('./NotifyService');

var mailbox = {};

var getEmails = function(callback) {
    var emails = [];

    sails.log.info('eaggeage');

    var mailListener = new MailListener({
        username: mailbox.username,
        password: mailbox.password,
        host: sails.config.imap.host,
        port: sails.config.imap.port, // imap port
        tls: sails.config.imap.tls,
        tlsOptions: { rejectUnauthorized: true },
        mailbox: "INBOX", // mailbox to monitor
        //searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved
        markSeen: false, // all fetched email willbe marked as seen and not fetched next time
        fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
        mailParserOptions: {streamAttachments: false}, // options to be passed to mailParser lib.
        attachments: false // download attachments as they are encountered to the project directory
        //attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
    });

    mailListener.on("server:connected", function(){
        sails.log.info("imapConnected");
    });

    mailListener.on("error", function(err){
        sails.log.info(err);
        callback(err);
    });

    mailListener.on("mail", function(mail, seqno, attributes) {
        emails.push(mail);
    });

    mailListener.on("done", function(){
        sails.log.info('Found %s emails', emails.length);
        callback(null, emails)
    });

    sails.log.info('Connecting to the mailbox');

    mailListener.start();
};

var checkEmailHealth = function(emails, callback) {
    var health = {
        warning: 0,
        critical: 0
    };

    var timeNow = new Date();

    _.map(emails, function(email) {
        var received = new Date(email.date);

        var seconds = Math.round((timeNow - received)/1000);

        if (seconds > 500) {
            health.critical++;
            return callback();
        }

        if (seconds > 1000) {
            health.warning++;
            return callback();
        }
    });
};

var sendNotifications = function (health, callback) {
    var action = null;

    if (health.warning > 0) action = 'WARNING';
    if (health.critical > 0) action = 'CRITICAL';

    var emailContent = {
        from: 'reece.fenwick@suncorp.com.au'
    };

    if (action === 'CRITICAL') {
        emailContent.to = 'reece.fenwick@suncorp.com.au'; // Can we add SMS # in the TO or BCC?
        emailContent.subject = 'Mailbox Monitor - Critical Alert for mailbox' + mailbox.name;
        emailContent.message = '';
    }

    if (action === 'WARNING') {
        emailContent.to = 'reece.fenwick@suncorp.com.au'; // Can we add SMS # here?
        emailContent.subject = 'Mailbox Monitor - Warning for mailbox' + mailbox.name;
        emailContent.message = '';
    }

    if (!action) {
        return callback();
    }
};

var checkMailbox = function(props, callback) {
    if(typeof callback === 'undefined') throw Error('No callback provided');

    sails.log.info('Starting mailbox health check %j', props.id);

    mailbox = props;

    async.waterfall([
        getEmails,
        checkEmailHealth,
        sendNotifications
    ], function (err) {
        sails.log.info('Completed processing %s', mailbox.name);

        if (err) {
            sails.log.error(err);
            callback(err);
        } else {
            callback();
        }
    });
};

module.exports = checkMailbox;