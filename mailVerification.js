var express = require('express');
var nodemailer = require("nodemailer");
var app = express();
const jwt = require("jsonwebtoken")
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const async = require('async');
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
    database: 'test',

});



app.post('/insert', async function (req, res) {

    let pswd = req.body.password
    let email = req.body.email;
    let username = req.body.username;
    let contact = req.body.contact;
    const hashedPassword1 = await bcrypt.hash(pswd, 10);

    var sql =
        'INSERT INTO userdata(password,email) VALUES(?,?)'
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





app.post('/check', function (req, res) {
    let name = req.body.email;
    let pass = req.body.password;



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
                            // accessToken: "https://oauth2.googleapis.com/token",
                            // expiresIn: 3600000

                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
                    const rand = Math.floor((Math.random() * 100) + 54);

                    const link = "http://" + req.get('host') + "/verify?id=" + token;
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
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            console.log("email is verified");
            res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
        } else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    } else {
        res.end("<h1>Request is from unknown source");
    }
});


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