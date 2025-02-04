const express = require("express");
const router = express.Router();
const { protect } = require("../controller/auth");
const {
    createFeedback,
    getFeedbacks,
    getFeedback,
    deleteFeedback,
} = require("../controller/feedbackController");

// end points for the feedback routes
router.route("/").post(protect, createFeedback).get(protect, getFeedbacks);
router.route("/:id").get(protect, getFeedback).delete(protect, deleteFeedback);



module.exports = router;