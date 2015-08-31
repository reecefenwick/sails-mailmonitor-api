/**
 * Cron configuration where you can define cron tasks with range time and callbacks.
 *
 * Look here for detailed examples https://github.com/ghaiklor/sails-hook-cron
 */

var async = require('async');

var CheckMailbox = require('../api/services/CheckMailbox');
var checkingMailbox = false;

module.exports.cron = {
    checkMailbox: {
        schedule: '* * * * * *',
        onTick: function(done) {
            sails.log(checkingMailbox);

            if (checkingMailbox) {
                return done();
            }

            checkingMailbox = true;

            sails.log.info('Starting CheckMailbox job now');

            var Mailbox = sails.models.mailbox;

            Mailbox
                .find({ active: true })
                .then(function(mailboxes) {
                    if (!mailboxes) return done();

                    sails.log.info('%s mailboxes to check', mailboxes.length);

                    async.eachLimit(mailboxes, 1, function(mailbox, callback) {
                        try {
                            CheckMailbox(mailbox, done);
                        } catch (e) {
                            sails.log.error(e);
                        }
                    }, function(err) {
                        if (err) {
                            sails.log.error('Error checking %s', mailbox.id);
                            sails.log.error(err);
                        }

                        return done(true);
                    });
                })
                .catch(function(err) {
                    done(true);
                    sails.log.error(err);
                })
        },
        onComplete: function(isDone) {
            if (isDone) {
                sails.log.info('Finished checking the mailbox')
                checkingMailbox = false;
            }
        }
    }
};
