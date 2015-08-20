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
    }
};
