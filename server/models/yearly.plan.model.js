const mongoose = require("mongoose");

// create the yearly schema
// approved person, year, file, filename
const yearlyPlanSchema = new mongoose.Schema({
    filename: { type: String, required: false },
    file: { type: String, required: false },
    year: { type: Number, required: false },
    approvedBy: { type: String, required: false },
    createdAt: { type: Date, default: Date.now() }
});


const YearlyPlan = mongoose.model("YearlyPlan", yearlyPlanSchema);
module.exports = { YearlyPlan };