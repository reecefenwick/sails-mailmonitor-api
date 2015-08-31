/**
 * Production environment settings
 * @description :: This section overrides all other config values ONLY in production environment
 */

module.exports = {
  port: 80,
  log: {
    level: 'info'
  },
  imap: {
    host: 'gmail.com',
    port: 993,
    tls: true
  },
  smtp: {
    host: "smlsmtp.suncorpmetway.net",
    port: 25
  }
};
