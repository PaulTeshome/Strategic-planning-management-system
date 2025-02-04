const handleFactory = require("./handlerFactory")
const {Feedback} = require("../models/feedback.model");
const catchAsync = require("../utils/catchAsync");
const StrategicPlan = require("../models/strategic.plan.model");
const { StatusCodes } = require("http-status-codes");
const APIError = require("../utils/apiError");


// const createFeedback = handleFactory.createOne(Feedback);
const getFeedbacks = handleFactory.getAll(Feedback);
const getFeedback = handleFactory.getOne(Feedback);
const deleteFeedback = handleFactory.deleteOne(Feedback);

const createFeedback = catchAsync(async (req, res, next) => {
    const feedback = req.body;
    const { message, plan_id  } = feedback;
    const user_id = req.user.id
    // check if plan exists
    const plan = await StrategicPlan.findById(plan_id);

    if (!plan) {
        return next(new APIError('Plan does not exist', StatusCodes.BAD_REQUEST))
    }

    // update the plan to have a status of pending
    plan.status = 'pending';
    await plan.save();


    const newFeedback = await Feedback.create({ message, plan_id, user_id });
    res.status(201).json({
        status: "success",
        data: {
            data: newFeedback
        }
    })
})

module.exports = {
    createFeedback,
    getFeedbacks,
    getFeedback,
    deleteFeedback
}