const { StatusCodes } = require("http-status-codes");
const Report = require("../models/report.model");
const APIError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");
const handlerfactory = require("./handlerFactory");

const createReport = handlerfactory.createOne(Report);
const getReport = handlerfactory.getAll(Report);
const getReportById = handlerfactory.getOne(Report);
const updateReport = handlerfactory.updateOne(Report);
const deleteReport = handlerfactory.deleteOne(Report);


const updateReportSchedule = catchAsync(async (req, res, next) => {
    // accept the department and year of the plan 
    const { department, year } = req.body;

    const updatebody = {
        // extract the schedule from the request body if it exists for each quarter
    };

    if (req.body.quarter_1_due_date) updatebody.quarter_1_due_date = new Date(req.body.quarter_1_due_date);
    if (req.body.quarter_2_due_date) updatebody.quarter_2_due_date = new Date(req.body.quarter_2_due_date);
    if (req.body.quarter_3_due_date) updatebody.quarter_3_due_date = new Date(req.body.quarter_3_due_date);
    if (req.body.quarter_4_due_date) updatebody.quarter_4_due_date = new Date(req.body.quarter_4_due_date);


    // if the year or plan is not present bad request
    if (!year || !department) {
        return next(new APIError("Year or Plan is not present", StatusCodes.BAD_REQUEST));

    }

    // find the plan
    const plan = await Report.findOne({ department, year });
    // if the plan is not found return not found
    if (!plan) {
        return next(new APIError("Plan not found", StatusCodes.NOT_FOUND));
    }


    // if the plan is found update the plan
    // update the schedule of the plan
    // keep every other data the same only update the schedule of the plan
    console.log(plan, updatebody);
    let doc = await Report.updateOne({ _id: plan._id  }, updatebody, {new: true, runValidators: true});

    res.status(200).json({
        status: "success",
        data: {
            data: doc,
        },
    }); 

});

module.exports = {
    createReport,
    getReport,
    getReportById,
    updateReport,
    deleteReport,
    updateReportSchedule
};
