const handleFactory = require("../handlerFactory");
const strategicPlanModel = require("../../models/strategic.plan.model");
const catchAsync = require("../../utils/catchAsync");
const APIError = require("../../utils/apiError");
const { StatusCodes } = require("http-status-codes");

// const createStrategicPlan = handleFactory.createOne(strategicPlanModel);
const getStrategicPlan = handleFactory.getAll(strategicPlanModel);
const getStrategicPlanById = handleFactory.getOne(strategicPlanModel);
const updateStrategicPlan = handleFactory.updateOne(strategicPlanModel);
const deleteStrategicPlan = handleFactory.deleteOne(strategicPlanModel);


const createStrategicPlan = catchAsync(async (req, res, next) => {
    const plan = req.body;

    const {department, year} = plan

    // check if the department and year already exists
    const plancheck = await strategicPlanModel.findOne({department, year});

    // the plan main goal cannot be higher than 100
    // the plan main function must not be higher than the main goal
    // the detail goals added up should not be higher than the main function
    // the detail goals added up should be equal to the main function

    if (plancheck) {
        return next(new APIError('Plan already exists', StatusCodes.BAD_REQUEST))
    }

    const newPlan = await strategicPlanModel.create(plan);
    res.status(201).json({
        status: "success",
        data: {
            data: newPlan,
        },
    });
})


module.exports = {
    createStrategicPlan,
    getStrategicPlan,
    getStrategicPlanById,
    updateStrategicPlan,
    deleteStrategicPlan 
}