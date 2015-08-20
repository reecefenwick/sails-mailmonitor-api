/**
 * MailboxController
 *
 * @description :: Server-side logic for managing mailboxes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports.findAll = function(req, res) {

    var Mailbox = sails.models.mailbox;

    Mailbox
        .find()
        .populate('history')
        .then(function(mailboxes) {
            res.ok(mailboxes);
        })
        .catch(function(err) {
            sails.log(err);
            res.notFound(err);
        })
};