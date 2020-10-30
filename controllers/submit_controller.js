let Hub = require("../models/hub");
let Post = require("../models/post");
let Profile = require("../models/profile");

exports.hub_post_view = function (req, res) {
    let subscribed = false
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Profile.find({
        username: req.session.user,
        subscribed: req.params.hub,
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            // res.send("Unable to find hub state")
            return;
        } else {
            subscribed = true
        }
    }).then(function () {
        Hub.find({
            name: req.params.hub
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.send({
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.hub_post = function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: "post",
        hub: req.params.hub,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[${req.params.hub}] post submitted!`)
        res.redirect(`/r/${req.params.hub}`)
    })
}
exports.hub_link_view = function (req, res) {
    let subscribed = false;
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });


    Profile.find({
        username: req.session.user,
        subscribed: req.params.hub,
    }, function (err, doc) {
        if (err) throw err;

        if (!doc.length) {
            // res.send("Unable to find hub state")
            return;
        } else {
            subscribed = true
        }
    }).then(function () {
        Hub.find({
            name: req.params.hub
        }, function (err, doc) {
            if (err) throw err

            if (doc.length) {
                res.send({
                    info: doc[0],
                    karma: karma,
                    state: subscribed,
                    isAuth: req.isAuthenticated(),
                })
            }
        })
    })
}
exports.hub_link = function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        body: req.body.body,
        username: req.session.user,
        type: type,
        link: req.body.link,
        hub: req.params.hub,
    }).save(function (err, doc) {
        if (err) throw error;

        console.log(`[${req.params.hub}] link submitted!`)
        res.redirect(`/r/${req.params.hub}`)
    })
}

exports.hub_search = function (req, res) {
    let hub = undefined
    let posts = undefined
    let subscribed = false
    let karma = 0

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }
    });

    Hub.find({
        name: req.params.hub
    }, function (err, doc) {
        if (err) throw err

        if (doc.length) {
            hub = doc[0]
        }
    }).then(function () {
        Profile.find({
            username: req.session.user,
            subscribed: req.params.hub,
        }, function (err, doc) {
            if (err) throw err;

            if (!doc.length) {
                // res.send("Unable to find hub state")
                return;
            } else {
                subscribed = true
            }
        }).then(function () {
            Post.find({
                $and: [{
                        hub: req.params.hub
                    },
                    {
                        title: {
                            $regex: '.*' + req.body.query + '.*',
                            $options: 'i'
                        }
                    }
                ]
            }).sort({
                votes: '-1'
            }).exec(function (err, result) {
                if (err) throw err;
                if (result.length) {
                    posts = result
                }

                console.log(`[${req.params.hub}] searching for posts which contain '{${req.body.query}}'`)
                res.send({
                    info: hub,
                    posts: result,
                    karma: karma,
                    state: subscribed,
                    query: req.body.query,
                    isAuth: req.isAuthenticated(),
                })
            })
        })
    })
}


// SUBMITING A POST
exports.feed_post = function (req, res) {
    Post({
        title: req.body.title,
        body: req.body.text,
        username: req.session.user,
        type: "post",
        hub: req.body.hub,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[feedpage] post submitted to [${req.body.hub}]`)
        res.redirect(`/r/${req.body.hub}/${doc._id}/comments`);
    });
}

// SUBMITING A LINK
exports.feed_link = function (req, res) {
    let type = "link"

    function checkURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    if (checkURL(req.body.link)) {
        type = "img"
    }

    Post({
        title: req.body.title,
        link: req.body.link,
        username: req.session.user,
        type: type,
        hub: req.body.hub,
    }).save(function (err, doc) {
        if (err) throw err;

        console.log(`[feedpage] link submitted to [${req.body.hub}]`)
        res.redirect(`/r/${req.body.hub}/${doc._id}/comments`);
    });
}


// SUBMITING A hub
exports.hub = function (req, res) {
    Profile.update({
            username: req.session.user
        }, {
            $push: {
                owned: req.body.hub
            }
        },
        function (err, doc) {
            if (err) throw err;

        }).then(function () {
        Hub({
            name: req.body.hub,
            description: req.body.description
        }).save(function (err, doc) {
            if (err) throw err

            console.log(`[feedpage] ${req.body.hub} hub created`)
            res.redirect(`/r/${req.body.hub}`);
        });
    });
}

// SEARCHING FOR A POST
exports.feed_search = function (req, res) {
    let subscribed = undefined;
    let hubs = undefined;
    let posts = undefined;
    let karma = 0;

    Profile.find({
            username: req.session.user
        }, function (err, result) {
            if (err) throw err;
            if (result.length) {
                subscribed = result[0]['subscribed'];
                karma = result[0]['karma_post'] + result[0]['karma_comment']
            }
        })
        .then(function () {
            Hub.find({}, function (err, doc) {
                    if (err) throw err;

                    if (doc.length) {
                        hubs = doc
                    }
                })
                .then(function () {
                    Post.find({
                            title: {
                                $regex: '.*' + req.body.query + '.*',
                                $options: 'i'
                            }
                        })
                        .sort({
                            votes: '-1'
                        })
                        .exec(function (err, result) {
                            if (err) throw err;
                            if (result.length) {
                                posts = result
                            }

                            console.log(`[feedpage] searching for posts which contain '{${req.body.query}}'`)
                            res.send({
                                posts: result,
                                hubs: hubs,
                                subscribed: subscribed,
                                karma: karma,
                                query: req.body.query,
                                isAuth: req.isAuthenticated()
                            })
                        });
                });
        });
}

exports.feed_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.send({
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}

exports.feed_post_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']

        }

        res.send({
            isAuth: req.isAuthenticated(),
            subscribed: subscribed,
            karma: karma
        });
    })
}
exports.feed_link_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.send({
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: subscribed
        });
    })
}
exports.hub_view = function (req, res) {
    let subscribed = undefined;
    let karma = 0;

    Profile.find({
        username: req.session.user
    }, function (err, result) {
        if (err) throw err;

        if (result.length) {
            subscribed = result[0]['subscribed']
            karma = result[0]['karma_post'] + result[0]['karma_comment']
        }

        res.send({
            isAuth: req.isAuthenticated(),
            karma: karma,
            subscribed: result[0]['subscribed']
        });
    })
}