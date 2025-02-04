const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
    // createdat, message, plan_id, user_id
    message: { type: String, required: false },
    plan_id: { type: mongoose.Schema.Types.ObjectId, ref: "StrategicPlan", required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    createdAt: { type: Date, default: Date.now() }
}, {
    timestamps: true });


const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = { Feedback };