const handleFactory = require("../handlerFactory");
const strategicPlanModel = require("../../models/strategic.plan.model");

const createStrategicPlan = handleFactory.createOne(strategicPlanModel);
const getStrategicPlan = handleFactory.getAll(strategicPlanModel);
const getStrategicPlanById = handleFactory.getOne(strategicPlanModel);
const updateStrategicPlan = handleFactory.updateOne(strategicPlanModel);
const deleteStrategicPlan = handleFactory.deleteOne(strategicPlanModel);

module.exports = {
    createStrategicPlan,
    getStrategicPlan,
    getStrategicPlanById,
    updateStrategicPlan,
    deleteStrategicPlan 
}