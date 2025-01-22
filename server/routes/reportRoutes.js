const router = require("express").Router();
const {
    generateStrategicPlanReport    
} = require("../controller/reportController/generateStrategicPlanReport");

// strategic plan report routes
router.get("/strategicPlan/:id",generateStrategicPlanReport);

module.exports = router;
