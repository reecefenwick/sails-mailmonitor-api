/**
 * PingController
 * @description :: Server-side logic for checking if different part of app is alive
 */

module.exports = {
  /**
   * Useful when you need to check if it's server is down
   */
  index: function (req, res) {
    sails.log('hello there')
    res.ok(null, null, 'HTTP server is working');
  }
};
