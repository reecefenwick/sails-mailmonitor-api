/**
 * Development environment settings
 * @description :: This section overrides all other config values ONLY in development environment
 */

module.exports = {
  port: 3001,
  log: {
    level: 'silly'
  },
  models: {
    connection: 'mongo'
  },
  imap: {
    host: 'imap.gmail.com',
    port: 993,
    tls: true
  },
  smtp: {
    host: "smlsmtp.suncorpmetway.net",
    port: 25
  }
};
