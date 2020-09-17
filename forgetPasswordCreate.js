var express = require("express");
const mysql = require('mysql')
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')
var nodemailer = require("nodemailer");

var bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail')

const connection = mysql.createConnection({
    //   // host     : process.env.DB_HOST,
    //   // user     : process.env.DB_USER,
    //   // password : process.env.DB_PASS,
    //   // database : process.env.DB_NAME,
    //   // port: process.env.DB_PORT
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',

});


require('dotenv').config({
    path: `${__dirname}/.env`
})


const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.post("/forgotpassword", function (req, res) {
    let email = req.body.email;
    let name = req.body.username;

    let sql = 'SELECT * FROM userdata WHERE email = ?';
    connection.query(sql, [email], function (err, rows, fields) {

        if (rows.length != 0) {
            const token = jwt.sign({
                id: rows[0]['username']
            }, 'secret', {
                expiresIn: 3600
            })
            console.log(token)
            // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            // const msg = {
            //     to: 'pal05249@gmail.com',
            //     from: 'pal05249@gmail.com',
            //     subject: 'Sending email for fun',
            //     text: 'Hello there.........sdfljksdfsldklk',
            //     html: '<strong>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            //         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            //         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            //         'If you did not request this, please ignore this email and your password will remain unchanged.\n' + '< /strong>'
            // };


            // sgMail.send(msg).then(() => {
            //     console.log('Message sent')
            // }).catch((error) => {
            //     // console.log(error.response.body)
            //     console.log(error.response.body.errors[0].message)
            // })
            var transport = nodemailer.createTransport({
                // host: "smtp.gmail.com",
                // port: 465,
                service: 'gmail',
                auth: {
                    user: "pal05249@gmail.com",
                    pass: process.env.SENDGRID_PASS
                }
            });


            var mailOptions = {
                to: 'pal40419083@gmail.com',
                from: 'passwordreset@demo.com',
                subject: 'Password Reset',
                text: '<strong>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n' + '< /strong>'
            }


            transport.sendMail(mailOptions, function (err) {

                if (!err) {
                    res.status(200).json({
                        "message": "success, Success! Your password has been changed."
                    });
                    console.log('message sent')
                }

            });

        } else {
            res.status(500).json({
                "message": "error, No account with that email address exists."
            })


        }
    })
});







app.listen(3000, function (err) {
    if (err) throw err;
    console.log("Server is running on port 3000")
})