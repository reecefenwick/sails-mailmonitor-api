/**
 * Cron configuration where you can define cron tasks with range time and callbacks.
 *
 * Look here for detailed examples https://github.com/ghaiklor/sails-hook-cron
 */

var mailboxCheckRunning = false;

module.exports.cron = {
    checkMailbox: {
        schedule: '* * * * * *',
        onTick: function(done) {
            sails.log.info('job run');

            return done();

            var CheckMailbox = sails.services.mailbox;
            var Mailbox = sails.models.mailbox;

            Mailbox
                .find({ active: true })
                .then(function(mailboxes) {
                    CheckMailbox();
                })
                .catch(function(err) {
                    sails.log.error(err);
                })
        },
        onComplete: function() {
            sails.log.verbose('done')
        }
    }
};
