const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')




app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Allow cross origin requests
app.use(cors())

var connection = mysql.createConnection({
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

app.post('/send', function (req, res) {
    let username = req.body.username;
    let password = req.body.password
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            // Now we can store the password hash in db.
            let sql = 'INSERT INTO userdata (username,password) VALUES(?,?)';
            connection.query(sql, [username, hash],
                function (err, result) {
                    if (err)
                        throw err;
                    else
                    if (result) {
                        console.log("Success")
                        res.json({
                            'message': 'Success'
                        });
                    }


                });
            connection.end();

        });
    });


})


app.post('/authenticate', function (req, res) {
    const name = req.body.username;
    const password = req.body.password;



    let sql = 'SELECT * FROM userdata WHERE username = ?';
    connection.query(sql, [name], function (err, rows, fields) {
        const passwordFromDB = rows[0]['password'];


        if (rows.length != 0) {
            console.log(rows[0]['username'])
            console.log(passwordFromDB)
            // console.log(hash)
            console.log(password)


            bcrypt.compare(password, passwordFromDB, function (err, result) {
                // console.log(result)
                if (result == true) {
                    console.log('password match')
                    var token = jwt.sign({
                        id: rows[0]['username']
                    }, 'secret', {
                        expiresIn: 86400
                    });

                    res.json({
                        auth: true,
                        token: token
                    });
                } else {
                    res.json({
                        'result': 'error',
                        'msg': 'Invalid Password '
                    });

                }

            })

        } else {

            res.send({
                'result': 'error',
                'msg': 'User Not Found'
            });

        }
    });

});


app.listen(3000, function (err) {
    if (err)
        console.log(err)
    else console.log('server is listening to port 3000')
})