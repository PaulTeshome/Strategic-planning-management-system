const express = require("express");
const { uploadYearlyPlan, getYearlyPlan, getAllYearlyPlan } = require("../controller/yearlyPlanController/yearlyPlanController");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../controller/auth");

const upload = multer({ dest: "../../public/uploads/" });
// handle file and other upload
// add the multer to accept a file
router.post("/",  protect ,uploadYearlyPlan);
router.get("/", protect, getAllYearlyPlan);
router.get("/:id", protect, getYearlyPlan);

// router.get("/", getAllYearlyPlan )


module.exports = router;