
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
  quarter_2: { type: Number, required: false },
  quarter_3: { type: Number, required: false },
  quarter_4: { type: Number, required: false },
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


const strategicPlanSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



// **🔹 Pre-Save Validation Middleware**
strategicPlanSchema.pre("validate", function (next) {
  // 1️⃣ **Check if total weight of `main_goals` exceeds 100`
  const totalMainGoalWeight = this.planData.reduce((sum, row) => sum + (row.weight || 0), 0);
  if (totalMainGoalWeight > 100) {
    return next(new Error("Total weight of main goals cannot exceed 100."));
  }

  // 2️⃣ **Check if `main_function.weight` matches the sum of `detail_function.weight``
  for (const row of this.planData) {
    for (const mainFunc of row.main_functions) {
      const totalDetailWeight = mainFunc.detail_functions.reduce((sum, detailFunc) => sum + (detailFunc.weight || 0), 0);
      
      if (mainFunc.weight !== totalDetailWeight) {
        return next(new Error(`Main function '${mainFunc.main_func_title}' weight must equal the sum of its detail functions.`));
      }
    }
  }

  next(); // If validation passes, proceed with saving
});


// Create the Model
const StrategicPlan = mongoose.model('StrategicPlan', strategicPlanSchema);

module.exports = StrategicPlan;


