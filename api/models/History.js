/**
 * History.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    identity: 'history',

    attributes: {
        "success": {
            type: 'boolean',
            required: true
        },
        "startTime": {
            type: 'date',
            required: true
        },
        "finishTime": {
            type: 'date',
            required: true
        },
        "warnings": {
            type: 'number',
            required: true
        },
        "criticals": {
            type: 'number',
            required: true
        },
        "totalEmails": {
            type: 'number'
        },
        mailbox: {
            model: 'mailbox'
        }
    }
};