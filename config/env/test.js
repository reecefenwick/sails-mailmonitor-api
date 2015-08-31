/**
 * Test environment settings
 * @description :: This section overrides all other config values ONLY in test environment
 */

module.exports = {
  log: {
    level: 'silent'
  },
  models: {
    connection: 'memory',
    migrate: 'drop'
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
