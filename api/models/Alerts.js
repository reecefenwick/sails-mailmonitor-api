/**
* Alerts.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    identity: 'alerts',

  attributes: {
        level: {
          type: 'string',
          required: true
        },
        threshold: {
          type: 'integer',
          required: true
        },
        email: {
          type: 'email',
          required: true,
          defaultsTo: null
        },
        mobile: {
          type: 'string',
          defaultsTo: null
        },
        lastWarning: {
          type: 'datetime',
          required: false,
          defaultsTo: null
        },
      mailbox: {
          model: 'mailbox'
      }
      }
  };
