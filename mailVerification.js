var express = require('express');
var nodemailer = require("nodemailer");
var app = express();
const jwt = require("jsonwebtoken")
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const async = require('async');
const verifyToken = require('./jwtMiddleware')
const googleapis = require("googleapis")
const gapi = require("./gapi")
const {
    JsonWebTokenError
} = require('jsonwebtoken');
require('dotenv').config({
    path: `${__dirname}/.env`
})
app.use(bodyParser.urlencoded({
    extended: false
}))
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/



const connection = mysql.createConnection({
    //   // host     : process.env.DB_HOST,
    //   // user     : process.env.DB_USER,
    //   // password : process.env.DB_PASS,
    //   // database : process.env.DB_NAME,
    //   // port: process.env.DB_PORT
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'userdata',

});



app.post('/insert', verifyToken, async function (req, res) {

    let pswd = req.body.password
    let email = req.body.email;
    let username = req.body.username;
    let contact = req.body.contact;
    const hashedPassword1 = await bcrypt.hash(pswd, 10);

    var sql =
        'INSERT INTO test(password,email) VALUES(?,?)'
    connection.query(sql, [hashedPassword1, email], function (err, data) {
        if (err) {
            console.log(err)
        } else {
            res.status(200).json({
                message: "success"
            })
            console.log('successfully inserted into db')

            // res.redirect('/api/login')
        }
    })
    connection.end();
})





app.post('/check', verifyToken, function (req, res) {
    let name = req.body.email;
    let pass = req.body.password;


    var passport = require('passport'),
        GoogleStrategy = require('./google_oauth2'),
        config = require('../config');



    //start - To get tokens from g-api



    // passport.use('google-imap', new GoogleStrategy({
    //     // clientID: config('google.api.client_id'),
    //     clientID: "65042886536-kt60ccbn3qdo6v132bh1t38t0ohmkqbe.apps.googleusercontent.com",
    //     // clientSecret: config('google.api.client_secret')
    //     clientSecret: "dOhd25DXglXeQsOjoszg9mTd"
    // }, function (accessToken, refreshToken, profile, done) {
    //     console.log(accessToken, refreshToken, profile);
    //     done(null, {
    //         access_token: accessToken,
    //         refresh_token: refreshToken,
    //         profile: profile
    //     });
    // }));

    // exports.mount = function (app) {
    //     app.get('/add-imap/:address?', function (req, res, next) {
    //         passport.authorize('google-imap', {
    //             scope: [
    //                 'https://mail.google.com/',
    //                 'https://www.googleapis.com/auth/userinfo.email'
    //             ],
    //             callbackURL: config('web.vhost') + '/add-imap',
    //             accessType: 'offline',
    //             approvalPrompt: 'force',
    //             loginHint: req.params.address
    //         })(req, res, function () {
    //             res.send(req.user);
    //         });
    //     });
    // };



    // end - to get tokens from gapi

    // const {
    //     google
    // } = require('googleapis');

    // const oauth2Client = new google.auth.OAuth2(
    //     "65042886536-kt60ccbn3qdo6v132bh1t38t0ohmkqbe.apps.googleusercontent.com",
    //     "dOhd25DXglXeQsOjoszg9mTd",
    //     "http://localhost:3000/api"
    // );

    // // generate a url that asks permissions for Blogger and Google Calendar scopes
    // const scopes = [
    //     'https://www.googleapis.com/auth/blogger',
    //     'https://www.googleapis.com/auth/calendar'
    // ];

    // const url = oauth2Client.generateAuthUrl({
    //     // 'online' (default) or 'offline' (gets refresh_token)
    //     access_type: 'offline',

    //     // If you only need one scope you can pass it as a string
    //     scope: scopes
    // });


    // // GET / oauthcallback ? code = {
    // //     authorizationCode
    // // }

    // // This will provide an object with the access_token and refresh_token.
    // // Save these somewhere safe so they can be used at a later time.
    // const {
    //     tokens
    // } = await oauth2Client.getToken(code)
    // oauth2Client.setCredentials(tokens);


    // oauth2Client.on('tokens', (tokens) => {
    //     if (tokens.refresh_token) {
    //         // store the refresh_token in my database!
    //         console.log(tokens.refresh_token);
    //     }
    //     console.log(tokens.access_token);
    // });

    // oauth2Client.setCredentials({
    //     refresh_token: `STORED_REFRESH_TOKEN`
    // });








    let sql = 'SELECT * FROM userdata WHERE email = ?';
    connection.query(sql, [name], function (err, rows, fields) {
        console.log(rows)
        if (rows.length != 0) {
            console.log(rows[0]['password'])
            console.log(pass)

            bcrypt.compare(pass, rows[0]['password'], function (err, result) {
                if (result == true) {
                    console.log('password match')
                    const token = jwt.sign({
                        id: rows[0]['user_id']
                    }, 'secret', {
                        expiresIn: 86400
                    });

                    res.json({
                        auth: true,
                        token: token
                    });

                    var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "pal40419083@gmail.com",
                            // pass: process.env.SENDGRID_PASS,
                            type: 'OAuth2',
                            clientId: "65042886536-kt60ccbn3qdo6v132bh1t38t0ohmkqbe.apps.googleusercontent.com",
                            clientSecret: "dOhd25DXglXeQsOjoszg9mTd",
                            refreshToken: "1//04bwcQAhSuiSSCgYIARAAGAQSNwF-L9IrrWL9nr9hczweY13JkPwXzjRBbOMJYa6GWo7wB9zhpOIK_KgqsOAd6XpyVTcpx9JuTTU",
                            accessToken: "ya29.a0AfH6SMCcQnv5vKUXvb9ooYIT5xHpQZsDpOzuOFFKr2PQBF_p1S6qEsl2Mj7PWyi_0Vi0s0vEde43TyVoU-sZPwPiCEw1c_1Cvk_3fwvTVL8faVaPPdWCqScvDfAItX_x8feqfp9OHpcx3F2eoWG6s67i_lYFMKFHKbM",
                            expiresIn: 3600000

                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    const rand = Math.floor((Math.random() * 100) + 54);

                    const link = "http://" + req.get('host') + "/verify?id=" + token;
                    console.log(link)
                    // const link = "http://" + req.get('host') + "/verify?id=" + rand;
                    var mailOptions = {
                        from: 'youremail@gmail.com',
                        to: 'pal05249@gmail.com',
                        subject: 'Sending Email via Node.js',
                        html: `Hello, Please Click on the link to verify your email. <a href=${link}>Click here to verify</a>`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }


                    })
                } else {
                    res.json({
                        'result': 'error',
                        'msg': 'Invalid Password '
                    });

                }

            });
        } else {

            res.send({
                'result': 'error',
                'msg': 'User Not Found'
            });

        }
    });
})




// app.get('/sendMail', function (req, res) {

//     const rand = Math.floor((Math.random() * 100) + 54);

//     // const link = "http://" + req.get('host') + "/verify?id=" + token.token;
//     const link = "http://" + req.get('host') + "/verify?id=" + rand;
//     var mailOptions = {
//         from: 'youremail@gmail.com',
//         to: 'pal05249@gmail.com',
//         subject: 'Sending Email via Node.js',
//         html: `Hello, Please Click on the link to verify your email. <a href=${link}>Click here to verify</a>`
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });

// });











// var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });
// app.get('/send', function (req, res) {
//     rand = Math.floor((Math.random() * 100) + 54);
//     host = req.get('host');
//     link = "http://" + req.get('host') + "/verify?id=" + rand;
//     mailOptions = {
//         to: req.query.to,
//         subject: "Please confirm your Email account",
//         html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
//     }
//     console.log(mailOptions);
//     smtpTransport.sendMail(mailOptions, function (error, response) {
//         if (error) {
//             console.log(error);
//             res.end("error");
//         } else {
//             console.log("Message sent: " + response.message);
//             res.end("sent");
//         }
//     });
// });

app.get('/verify', function (req, res) {
    console.log(req.protocol + "://" + req.get('host'));
    const token = req.query;
    console.log(token)
    jwt.verify(token.id, 'secret', function (err, decoded) {

        if (err)

            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

        // if everything good, save to request for use in other routes

        req.userId = decoded.id;

        console.log(req.userId)

    });

});

// if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
//         console.log("Domain is matched. Information is from Authentic email");
//         if (req.query.id == rand) {
//             console.log("email is verified");
//             res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
//         } else {
//             console.log("email is not verified");
//             res.end("<h1>Bad Request</h1>");
//         }
//     } else {
//         res.end("<h1>Request is from unknown source");
//     }

// app.use(function(req,res,next) {
//     JWT.verify(req.cookies['token'], 'YOUR_SECRET', function(err, decodedToken) {
//       if(err) { /* handle token err */ }
//       else {
//        req.userId = decodedToken.id;   // Add to req object
//        next();
//       }
//     });
//    });
// const loginId = req.userId;



/*--------------------Routing Over----------------------------*/

app.listen(3000, function () {
    console.log("Express Started on Port 3000");
});