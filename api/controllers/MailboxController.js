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
        .populate('alerts')
        .then(function(mailboxes) {
            res.ok(mailboxes);
        })
        .catch(function(err) {
            sails.log(err);
            res.serverError(err);
        })
};

module.exports.findOne = function(req, res) {
    var Mailbox = sails.models.mailbox;


    console.log(req.params.id);
    Mailbox
        .findOne({
            id: req.params.id
        })
        .populate('history')
        .populate('alerts')
        .then(function(mailbox) {
            if (!mailbox) {
                return res.notFound();
            }

            res.ok(mailbox);
        })
        .catch(function(err) {
            sails.log.error(err);
            return res.serverError(err);
        })
};

module.exports.create = function(req, res) {
    var Mailbox = sails.models.mailbox;

    // Stop people from adding history when creating it.
    // Best approached by doing request validation/filtering.
    delete req.body.history;

    Mailbox
        .create(req.body)
        .exec(function(err, mailbox) {
            if (err) {
                sails.log.error(err);
                return res.serverError(err);
            }

            res.ok({
                id: mailbox.id
            });
        });
};

module.exports.update = function(req, res) {
    var Mailbox = sails.models.mailbox;

    Mailbox
        .update({
            id: req.params.id
        }, req.body)
        .then(function() {
            res.ok();
        })
        .catch(function(err) {
            res.serverError(err);
        })
};

module.exports.delete = function(req, res) {
    var Mailbox = sails.models.mailbox;

    Mailbox
        .destroy({
            id: req.params.id
        })
        .then(function() {
            res.ok();
        })
        .catch(function(err) {
            res.serverError(err);
        })
};