// var express = require("express");
// var loginroutes = require('./routes/loginroutes');
// var bodyParser = require('body-parser');
// let cors = require('cors')
// const emailSender = require('./emailSender')
// const connection = require('./routes/loginroutes')
// var flash = require('express-flash');
// var bodyParser = require('body-parser');







// exports.getResetToken = async function (req, res) {
//     let sql =
//         'SEARCH * FROM users WHERE resetPasswodToken=req.params.token AND resetPasswordExpires= created >= today;'
//     connection.query(sql, function (err, user) {
//         if (err) {
//             console.log(err)
//         } else if (!user) {
//             req.flash('error', 'Password reset token is invalid or has expired');
//             return res.redirect('/forgot');
//         }
//     });
// }





// exports.forgotPassword = async function (req, res, next) {
//     async.waterfall([
//             function (done) {
//                 crypto.randomBytes(20, function (err, buf) {
//                     var token = buf.toString('hex');
//                     done(err, token);
//                 });
//             },
//             function (token, done) {
//                 connection.query('SEARCH * FROM users WHERE email=req.body.email', function (err, user) {
//                     if (err) {
//                         console.log(err)
//                     } else if (!user) {
//                         req.flash('error', 'No account with that email address exists.');
//                         return res.redirect('/forgot');
//                     }

//                     user.resetPasswordToken = token;
//                     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//                     done(err, token, user)
//                 });

//             },

//             function (token, user, done) {
//                 var smtpTransport = nodemailer.createTransport('SMTP', {
//                     service: 'SendGrid',
//                     auth: {
//                         user: 'process.env.SENDGRID_USERNAME',
//                         pass: 'process.env.SENDGRID_PASS'
//                     }
//                 });


//                 var mailOptions = {
//                     to: user.email,
//                     from: 'passwordreset@demo.com',
//                     subject: 'Node.js Password Reset',
//                     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
//                         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//                         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
//                         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
//                 };


//                 smtpTransport.sendMail(mailOptions, function (err) {
//                     req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
//                     done(err, 'done');
//                 });
//             }


//         ],
//         function (err) {
//             if (err) return next(err);
//             res.redirect('/forgot');
//         });

// };




exports.reset = async function (req, res) {
    async.waterfall([
        function (done) {

            let sql =
                'SEARCH * FROM users WHERE (resetPasswodToken,resetPasswordExpires) values(?,?)'
            connection.query(sql, [req.params.token, created > today], function (err, user) {
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
}