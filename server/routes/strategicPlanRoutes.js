// import the controlelrs

const {
    getStrategicPlan,
    getStrategicPlanById,
    createStrategicPlan,
    updateStrategicPlan,
    deleteStrategicPlan,
} = require("../controller/strategicPlanController/strategicPlanController");


const express = require("express");
const router = express.Router();


// get the routes in action

router.get("/", getStrategicPlan);
router.get("/:id", getStrategicPlanById);
router.post("/", createStrategicPlan);
router.patch("/:id", updateStrategicPlan);
router.delete("/:id", deleteStrategicPlan);

module.exports = router;