
const StatusCodes = require("http-status-codes");
const APIError = require("../../utils/apiError");
const catchAsync = require("../../utils/catchAsync");
const StrategicPlanModel = require("../../models/strategic.plan.model");


const generateStrategicPlanReport = catchAsync(async (req, res, next) => {
// Generate Report Endpoint
  const { id } = req.params;

    // Find the strategic plan by ID
    const strategicPlan = await StrategicPlanModel.findById(id);

    if (!strategicPlan) {
        return next(new APIError(`Strategic plan not found`, StatusCodes.NOT_FOUND));
    }

    // Generate a report
    const report = {
      strategicPlanId: strategicPlan._id,
      mainGoal: strategicPlan.main_goal,
      totalWeight: strategicPlan.weight,
      mainFunctions: strategicPlan.main_functions.map((mainFunc) => ({
        title: mainFunc.main_func_title,
        weight: mainFunc.weight,
        detailFunctions: mainFunc.detail_functions.map((detailFunc) => ({
          title: detailFunc.detail_func_title,
          weight: detailFunc.weight,
          KPIs: detailFunc.KPIs.map((kpi) => ({
            title: kpi.KPI_title,
            measurement: kpi.measurement,
            pastYear: kpi.past_year,
            presentGoal: kpi.present_goal,
            quarters: {
              Q1: kpi.quarter_1,
              Q2: kpi.quarter_2,
              Q3: kpi.quarter_3,
              Q4: kpi.quarter_4,
            },
            department: kpi.department,
          })),
        })),
      })),
    };

    // Return the report
    res.json({ success: true, report });
});


module.exports = { generateStrategicPlanReport };