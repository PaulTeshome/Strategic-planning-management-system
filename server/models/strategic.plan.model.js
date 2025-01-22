
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// KPI Schema
const kpiSchema = new Schema({
  number: { type: String, required: true },
  KPI_title: { type: String, required: true },
  measurement: { type: String, required: true },
  weight: { type: Number, required: true },
  past_year: { type: Number, required: true },
  present_goal: { type: Number, required: true },
  quarter_1: { type: Number, required: true },
  quarter_2: { type: Number, required: true },
  quarter_3: { type: Number, required: true },
  quarter_4: { type: Number, required: true },
  department: { type: String, required: true },
});

// Detail Function Schema
const detailFunctionSchema = new Schema({
  number: { type: String, required: true },
  detail_func_title: { type: String, required: true },
  weight: { type: Number, required: true },
  KPIs: [kpiSchema],
});

// Main Function Schema
const mainFunctionSchema = new Schema({
  number: { type: String, required: true },
  main_func_title: { type: String, required: true },
  weight: { type: Number, required: true },
  detail_functions: [detailFunctionSchema],
});


// Strategic Plan Schema
// year: date.getFullYear(),
// department: user.r_data,
// plan_document: null,
// planData: rows,
// status -> ['pending', 'requested', 'approved', 'submitted']
const row = new Schema({
  year: { type: Number, required: true },
  department: { type: String, required: false},
  plan_document: { type: String, default: null },
  planData: { type: [mainFunctionSchema], default: null },
  createdAt: { type: Date, default: Date.now },
});


const strategicPlanSchema = new Schema({
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  plan_document: {
    type: String,
    default: null,
  },
  planData: {
    type: [row],
    default: [],
  },
  status: {
    type: String,
    enum: ['pending', 'requested', 'approved', 'submitted'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Model
const StrategicPlan = mongoose.model('StrategicPlan', strategicPlanSchema);

module.exports = StrategicPlan;


