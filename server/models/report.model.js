

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
  quarter_1_progress: { type: Number, required: true },
  quarter_2: { type: Number, required: true },
  quarter_2_progress: { type: Number, required: true },
  quarter_3: { type: Number, required: true },
  quarter_3_progress: { type: Number, required: true },
  quarter_4: { type: Number, required: true },
  quarter_4_progress: { type: Number, required: true },
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
  number: { type: String, required: false },
  main_goal: { type: String, required: false },
  weight: { type: Number, required: false },
  main_functions: [mainFunctionSchema],
});


const ReportSchema = new Schema({
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
  DueDate: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Model
const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;


