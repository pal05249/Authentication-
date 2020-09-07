import {
    createTransport
} from 'nodemailer';
require('dotenv').config({
    path: `${__dirname}/.env`
})

// // nod


// // CREATE TABLE `ResetTokens`(
// //     `id`
// //     int(11) NOT NULL AUTO_INCREMENT,
// //     `email`
// //     varchar(255) DEFAULT NULL,
// //     `token`
// //     varchar(255) DEFAULT NULL,
// //     `expiration`
// //     datetime DEFAULT NULL,
// //     `createdAt`
// //     datetime NOT NULL,
// //     `updatedAt`
// //     datetime NOT NULL,
// //     `used`
// //     int(11) NOT NULL DEFAULT '0',
// //     PRIMARY KEY(`id`)
// // ) ENGINE = InnoDB AUTO_INCREMENT = 21 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;




// // router.get('/forgot-password', function (req, res, next) {
// //     res.render('user/forgot-password', {});
// // });

// // router.post('/forgot-password', async function (req, res, next) {
// //     //ensure that you have a user with this email
// //     var email = await User.findOne({
// //         where: {
// //             email: req.body.email
// //         }
// //     });
// //     if (email == null) {
// //         /**
// //          * we don't want to tell attackers that an
// //          * email doesn't exist, because that will let
// //          * them use this form to find ones that do
// //          * exist.
// //          **/
// //         return res.json({
// //             status: 'ok'
// //         });
// //     }
// //     /**
// //      * Expire any tokens that were previously
// //      * set for this user. That prevents old tokens
// //      * from being used.
// //      **/
// //     await ResetToken.update({
// //         used: 1
// //     }, {
// //         where: {
// //             email: req.body.email
// //         }
// //     });

// //     //Create a random reset token
// //     var fpSalt = crypto.randomBytes(64).toString('base64');

// //     //token expires after one hour
// //     var expireDate = new Date();
// //     expireDate.setDate(expireDate.getDate() + 1 / 24);

// //     //insert token data into DB
// //     await ResetToken.create({
// //         email: req.body.email,
// //         expiration: expireDate,
// //         token: token,
// //         used: 0
// //     });

// //     //create email
// //     const message = {
// //         from: process.env.SENDER_ADDRESS,
// //         to: req.body.email,
// //         subject: process.env.FORGOT_PASS_SUBJECT_LINE,
// //         text: 'To reset your password, please click the link below.\n\nhttps://' + process.env.DOMAIN + '/user/reset-password?token=' + encodeURIComponent(token) + '&email=' + req.body.email
// //     };

// //     //send email
// //     transport.sendMail(message, function (err, info) {
// //         if (err) {
// //             console.log(err)
// //         } else {
// //             console.log(info);
// //         }
// //     });

// //     return res.json({
// //         status: 'ok'
// //     });
// // });



const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'pal40419083@gmail.com',
    from: 'pal05249@gmail.com',
    subject: 'Sending email for fun',
    text: 'Hello there.........sdfljksdfsldklk',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail.send(msg).then(() => {
    console.log('Message sent')
}).catch((error) => {
    console.log(error.response.body)
    // console.log(error.response.body.errors[0].message)
})