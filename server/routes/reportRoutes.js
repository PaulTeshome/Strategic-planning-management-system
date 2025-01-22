const router = require("express").Router();
const { createReport, getReport, updateReport, deleteReport, getReportById } = require("../controller/reportController");


// report routes
router.route("/").post(createReport).get(getReport);
router.route("/:id").patch(updateReport).delete(deleteReport).get(getReportById);




module.exports = router;
