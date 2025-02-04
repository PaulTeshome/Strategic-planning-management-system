const express = require("express");
const { uploadYearlyPlan } = require("../controller/yearlyPlanController/yearlyPlanController");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../controller/auth");

const upload = multer({ dest: "../../public/uploads/" });
// handle file and other upload
// add the multer to accept a file
router.post("/",  protect ,uploadYearlyPlan);

// router.get("/", getAllYearlyPlan )


module.exports = router;