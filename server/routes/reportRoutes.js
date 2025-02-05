const router = require("express").Router();
const { createReport, getReport, updateReport, deleteReport, getReportById, updateReportSchedule } = require("../controller/reportController");


// report routes
router.route("/").post(createReport).get(getReport);
router.route("/schedule").patch(updateReportSchedule);
router.route("/:id").patch(updateReport).delete(deleteReport).get(getReportById);




module.exports = router;
