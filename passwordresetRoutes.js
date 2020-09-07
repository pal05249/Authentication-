require('dotenv').config({
    path: __dirname + '/.env'
})
var express = require("express");

const app = express();
const mysql = require('mysql')
var bodyParser = require('body-parser');
let cors = require('cors')
const async = require('async')
const crypto = require('crypto')



const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT

});





app.get('/reset/:token', function (req, res) {

    const rqt = req.params.token;

    let sql =
        'SEARCH * FROM users WHERE password=?'
    connection.query(sql, [rqt], function (err, user) {
        if (err) {
            console.log(err)
        } else if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired');
            return res.redirect('/forgot');
        }
    });
});



app.post('/forgot', function (req, res) {
    const email = req.body.email

    crypto.randomBytes(20, function (err, buf) {

        var token = buf.toString('hex');
    });

    connection.query('SEARCH * FROM users WHERE email=?', [email],
        function (err, user) {
            if (err) {
                console.log(err)
            } else if (!user) {
                req.send('error', 'No account with that email address exists.');
                return res.redirect('/forgot');
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        });


    var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
            user: 'process.env.SENDGRID_USERNAME',
            pass: 'process.env.SENDGRID_PASS'
        }
    });


    var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };


    smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
    });

});



app.post('/reset/:token', async function (req, res) {
    async.waterfall([
        function (done) {

            let sql =
                'SEARCH * FROM users WHERE resetPasswodToken=req.params.token AND resetPasswordExpires= created >= today;'
            connection.query(sql, function (err, user) {
                if (err) {
                    console.log(err)
                } else if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired');
                    return res.redirect('/forgot');
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                done(err, user);

            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: 'process.env.SENDGRID_USERNAME',
                    pass: 'process.env.SENDGRID_PASS'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
    });
});


app.listen(3000, function (err) {
    if (err) throw err
    console.log('connected to port 3000')
})