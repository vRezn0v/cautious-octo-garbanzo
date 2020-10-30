const bcrypt = require("bcrypt");
let Profile = require("../models/profile");
let User = require("../models/user");

exports.view = function (req, res) {
    if (req.isAuthenticated()) {
        Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;

            if (result.length) {
                karma = result[0]['karma_post'] + result[0]['karma_comment']
                res.send('./settings', {
                    chadpoints: chadpoints
                })
            }
        })
    } else {
        res.send('Login Required')
    }
}
exports.change_password = function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        if (err) throw err

        User.update({
            username: req.session.user
        }, {
            password: hash
        }, function (err, result) {
            if (err) throw err;

            if (result) {
                console.log(`[${req.session.user}] password changed!`)
                res.send("OK")
            }
        });
    });
}

exports.delete_user = function (req, res) {
    User.find({
        username: req.session.user
    }).remove(function (err, result) {
        if (err) throw err;

        if (result) {
            console.log(`[${req.session.user}] user deleted!`)
            res.send("OK")
        }
    });
}