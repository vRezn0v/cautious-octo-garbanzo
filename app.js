const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const passport = require("passport");
const db = require("./configs/database");

app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'coochie man',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.isauth = req.isAuthenticated();
    next();
});

app.use('/', require('./routes/auth'));
app.use('/', require('./routes/feed'));
app.use('/', require('./routes/index'));
app.use('/', require('./routes/settings'));
app.use('/h/', require('./routes/hub'));
app.use('/u/', require('./routes/profile'));
app.use('/api/', require('./routes/api'));


app.get('*', function (req, res) {
    res.status(404);
    res.send("error")
});

app.listen(process.env.PORT || 5000, function () {
    console.log("listening on port 5000!");
});