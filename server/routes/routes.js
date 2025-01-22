const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const strategicPlanRouter = require("./strategicPlanRoutes");
const reportRouter = require("./reportRoutes");

router.use("/users", userRouter);
router.use("/strategicPlan", strategicPlanRouter);
router.use("/reports", reportRouter);

module.exports = router;
