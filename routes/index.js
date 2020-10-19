const express = require("express");
const router = express.Router();

// CONTROLLERS
let post_controller = require('../controllers/post_controller')
let comment_controller = require('../controllers/comment_controller')
let hub_controller = require('../controllers/hub_controller')

// POSTS ROUTES
router.put('/edit/p/:id', post_controller.edit);
router.delete('/delete/p/:id', post_controller.delete);
router.put('/save/p/:id', post_controller.save);
router.put('/unsave/p/:id', post_controller.unsave);
router.put('/vote/p/:id', post_controller.vote);
router.get('/check/states/p', post_controller.check);

// COMMENTS ROUTES
router.put('/edit/c/:id', comment_controller.edit);
router.delete('/delete/c/:id', comment_controller.delete);
router.put('/save/c/:id', comment_controller.save);
router.put('/unsave/c/:id', comment_controller.unsave);
router.put('/vote/c/:id', comment_controller.vote);
router.get('/check/states/c', comment_controller.check);

// SUBBREDDIT ROUTES
router.get('/submit/check/:hub', hub_controller.check_hub);
router.put('/subscribe/:hub', hub_controller.subscribe);
router.put('/unsubscribe/:hup', hub_controller.unsubscribe);

module.exports = router;