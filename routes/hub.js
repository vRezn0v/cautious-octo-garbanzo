const express = require("express");
const router = express.Router();

// CONTROLLERS
let hub_controller = require("../controllers/hub_controller")
let comment_controller = require("../controllers/comment_controller")
let submit_controller = require("../controllers/submit_controller")

// ROUTES
router.get('/:hub', hub_controller.get_all);
router.get('/:hub/:id/comments', hub_controller.get_post);
router.get('/:hub/submit/post', submit_controller.hub_post_view);
router.get('/:hub/submit/link', submit_controller.hub_link_view);

router.post('/:hub/submit/post', submit_controller.hub_post);
router.post('/:hub/:id/comments', comment_controller.comment);
router.post('/:hub/submit/link', submit_controller.hub_link);
router.post('/:hub/search', submit_controller.hub_search);

router.get('/:hub/:id', function (req, res) {
    res.redirect(`/r/${req.params.hub}/${req.params.id}/comments`)
});

module.exports = router