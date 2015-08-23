/**
* Mailbox.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  identity: 'mailbox',

  attributes: {
    description: {
      type: 'string',
      required: true
    },
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    folderToMonitor: {
      type: 'string',
      required: true
    },
    active: {
      type: 'boolean',
      required: true,
      defaultsTo: false
    },
    history: {
      collection: 'history',
      via: 'mailbox'
    },
    alerts: {
      collection: 'alerts',
      via: 'mailbox'
    }
  }
};

