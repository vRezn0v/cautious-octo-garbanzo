let Hub = require("../models/hub");
let Post = require("../models/post");
let Profile = require("../models/profile");
let PostState = require("../models/postState")

exports.get_all = function (req, res) {
    let subscribed = undefined;
    let hubs = undefined;
    let posts = undefined;
    let chadpoints = 0;
    let sort = undefined;

    switch (req.query.sort) {
        case "top":
            sort = {
                votes: -1
            }
            break;
        case "new":
            sort = {
                time: -1
            }
            break;
        case "old":
            sort = {
                time: 1
            }
            break;
        default:
            sort = {
                votes: -1
            }
    }

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed'];
            chadpoints = result[0]['chadpoints'] + result[0]['comment_chadpoints']
        }
    }).then(function () {
        Hub.find({}, function (err, doc) {
            if (err) throw err;

            if (doc.length) {
                hubs = doc
            }
        }).then(function () {
            PostState.find({
                username: req.session.user
            }, function (err, doc) {
                if (err) throw err;

                if (doc.length) {
                    postStates = doc
                }
            }).then(function () {
                Post.find({}).sort(sort).exec(function (err, result) {
                    if (err) throw err;
                    if (result.length) {
                        posts = result
                    }

                    console.log(`[Frontpage] fetching posts!`)
                    res.send({
                        posts: posts,
                        hubs: hubs,
                        subscribed: subscribed,
                        chadpoints: chadpoints,
                        isAuth: req.isAuthenticated()
                    })
                });
            });
        });
    });
}
