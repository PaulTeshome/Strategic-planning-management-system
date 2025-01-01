const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const strategicPlanRouter = require("./strategicPlanRoutes");

router.use("/users", userRouter);
router.use("/strategicPlan", strategicPlanRouter);

module.exports = router;
