const express = require("express");
const router = express.Router();

let submit_controller = require("../controllers/submit_controller");
let feed_controller = require("../controllers/feed_controller");

router.get('/', feed_controller.get_all);
router.get('/submit/post', submit_controller.feed_post_view);
router.get('/submit/link', submit_controller.feed_link_view);
router.get('/submit/subreddit', submit_controller.hub_view);
router.post('/submit/post', submit_controller.feed_post);
router.post('/submit/link', submit_controller.feed_link);
router.post('/submit/subreddit', submit_controller.hub);
router.post('/search', submit_controller.feed_search);

module.exports = router;