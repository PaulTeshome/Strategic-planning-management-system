

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// KPI Schema
const kpiSchema = new Schema({
  number: { type: String, required: false },
  KPI_title: { type: String, required: false },
  measurement: { type: String, required: false },
  weight: { type: Number, required: false },
  past_year: { type: Number, required: false },
  present_goal: { type: Number, required: false },
  quarter_1: { type: Number, required: false },
  quarter_1_progress: { type: Number, required: false },
  quarter_2: { type: Number, required: false },
  quarter_2_progress: { type: Number, required: false },
  quarter_3: { type: Number, required: false },
  quarter_3_progress: { type: Number, required: false },
  quarter_4: { type: Number, required: false },
  quarter_4_progress: { type: Number, required: false },
  department: { type: String, required: false },
});

// Detail Function Schema
const detailFunctionSchema = new Schema({
  number: { type: String, required: false },
  detail_func_title: { type: String, required: false },
  weight: { type: Number, required: false },
  KPIs: [kpiSchema],
});

// Main Function Schema
const mainFunctionSchema = new Schema({
  number: { type: String, required: false },
  main_func_title: { type: String, required: false },
  weight: { type: Number, required: false },
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
    required: false,
  },
  department: {
    type: String,
    required: false,
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
  // DueDate: {
  //   type: Date,
  //   default: Date.now,
  // },
  // quarter one due date, quater two due date, quarter three due date, quarter four due date


  quater_1_due_date: {
    type: Date,
    default: Date.now,
  },
  quater_2_due_date: {
    type: Date,
    default: Date.now,
  },
  quater_3_due_date: {
    type: Date,
    default: Date.now,
  },
  quater_4_due_date: {
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


