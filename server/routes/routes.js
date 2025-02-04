const express = require("express");
const router = express.Router();

const userRouter = require("./userRoutes");
const strategicPlanRouter = require("./strategicPlanRoutes");
const reportRouter = require("./reportRoutes");
const yearlyPlanRouter = require("./yearlyplanRoutes")
const feedbackRouter = require("./feedbackRoutes");

router.use("/users", userRouter);
router.use("/strategicPlan", strategicPlanRouter);
router.use("/reports", reportRouter);
router.use("/yearlyplan", yearlyPlanRouter);
router.use("/feedback", feedbackRouter);


module.exports = router;
