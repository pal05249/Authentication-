const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const salt = 12;
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

app.post('/send', async function (req, res) {

    let password = req.body.password
    let email = req.body.email;
    const hashedPassword1 = await bcrypt.hash(password, 10);
    console.log(hashedPassword1)

    // Now we can store the password hash in db.
    let sql = 'INSERT INTO userdata (password,email) VALUES(?,?)';
    connection.query(sql, [hashedPassword1], email, (err, result) => {
        if (result) {
            console.log("Success");
            res.status(200).json({
                'message': 'Success'
            });
        } else
        if (err)
            console.log(err);
    });
    connection.end();

});






app.post('/authenticate', function (req, res) {
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

            });
        } else {

            res.send({
                'result': 'error',
                'msg': 'User Not Found'
            });

        }
    });
})
// })




app.listen(3000, function (err) {
    if (err)
        console.log(err)
    else console.log(' Auth server is listening to port 3000')
})