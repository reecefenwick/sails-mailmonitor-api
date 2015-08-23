/**
 * Route Mappings
 *
 * @description :: Your routes map URLs to views and controllers
 * @docs :: http://sailsjs.org/documentation/concepts/routes
 */

module.exports.routes = {
    'GET /api/mailbox': {
        controller: 'MailboxController',
        action: 'findAll'
    },
    'POST /api/mailbox': {
        controller: 'MailboxController',
        action: 'create'
    },
    'GET /api/mailbox/:id': {
        controller: 'MailboxController',
        action: 'findOne'
    },
    'PUT /api/mailbox/:id': {
        controller: 'MailboxController',
        action: 'update'
    },
    'DELETE /api/mailbox/:id': {
        controller: 'MailboxController',
        action: 'delete'
    }
};
