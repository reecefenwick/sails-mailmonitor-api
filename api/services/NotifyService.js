var nodemailer = require('nodemailer');


module.exports.sendEmail = function (mailOptions, callback) {
    if (typeof callback !== 'function') throw Error('No callback provided');

    var transporter = nodemailer.createTransport('SMTP', {
        host: "smlsmtp.suncorpmetway.net",
        port: 25
    });

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) return callback(err);

        console.log('Message sent: ' + info.response);

        callback(null, info);
    })
};
