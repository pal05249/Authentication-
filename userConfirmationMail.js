var express = require("express");
var nodemailer = require("nodemailer");



var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 25,
    secure: false,
    auth: {
        user: "pal05249@gmail.com",
        pass: "ldpjf1025"
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});


var mailOptions = {
    to: 'pal40419083@gmail.com',
    from: 'passwordreset@demo.com',
    subject: 'Password Reset',
    text: '<strong>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        // 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n' + '< /strong>'
}


transport.sendMail(mailOptions, function (err) {

    if (!err) {
        // res.status(200).json({
        //     "message": "success, Success! Your password has been changed."
        // });
        console.log('message sent')
    } else console.log(err);

});