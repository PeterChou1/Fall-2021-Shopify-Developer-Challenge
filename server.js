require("dotenv").config();
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const express = require('express');
const app = express();
const upload = multer({ dest: 'uploads/'});
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const http = require('http');
const port = Number(process.env.PORT || 4000);
const cors = require('cors');
const cookie = require('cookie');

app.use(
    cors({
        credentials: true,
        origin : ['http://localhost:4000', 'http://localhost:3000']
    })
)

var isAuthenticated = function(req, res, next) {
    if (!req.username) return res.status(401).json({error : "access denied"});
    next();
};

app.use(bodyParser.json());
app.use(session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(function (req, res, next){
    req.username = (req.session.username) ? req.session.username : null;
    next();
});

app.use(cookieParser());
app.post('/api/users/signup/', async function (req, res) {
    try {
        const password = await bcrypt.hash(req.body.password, 15);
        const username = req.body.username;
        await prisma.user.create({
            data : {
                username,
                password
            }
        })
        // init session
        req.session.username = username;
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
            path : '/', 
            maxAge: 60 * 60 * 24 * 7
        }));
        res.json({ success : `user ${username} signed up`});
    } catch (err) {
        if (
            err.message.includes(
              "Unique constraint failed on the fields: (`username`)"
            )
        ) {
            res.status(309).json({error : "user name already exist"});
        } else {
            res.status(500).json({error : err.message})
        }
    }
});

// curl -H "Content-Type: application/json" -X POST -d '{"username":"alice","password":"alice"}' -c cookie.txt localhost:3000/signin/
app.post('/api/users/signin/', async function (req, res) {
    try {
        var username = req.body.username;
        var password = req.body.password;
        const user = await prisma.user.findUnique({
            where: { username }
        });
        if (!user) return res.status(500).json({error : 'user does not exist'})
        const valid = await bcrypt.compare(password, user.password);
        // retrieve user from the databas
        if (!valid) return res.status(500).json({error : 'incorrect password'});
        //init session
        req.session.username = username;
        res.setHeader('Set-Cookie', cookie.serialize('username', username, {
            path : '/', 
            maxAge: 60 * 60 * 24 * 7
        }));
        res.json({ success : `user ${username} signed in`});
    } catch (err) {
        res.status(500).json({error : err.message});
    }

});

// curl -b cookie.txt -c cookie.txt localhost:3000/signout/
app.get('/api/users/signout/', isAuthenticated, function (req, res) {
    console.log(`signed out: ${req.username}`);
    req.session.destroy(_ => _);
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
});

app.get('/api/users/auth', function (req, res) {
    res.json({auth : !!req.username})
});

app.delete('/api/users/delete/', isAuthenticated, async function (req, res) {
    await prisma.user.delete({
        where: {
          username: req.username,
        },
    });
    req.session.destroy(_ => _);
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
});




http.createServer(app).listen(port, function (err) {
    if (err) console.log(err);
    else {
        console.log("HTTP server on http://localhost:%s", port);
    }
});
