const Report = require("../models/report.model");
const handlerfactory = require("./handlerFactory");



const createReport = handlerfactory.createOne(Report);
const getReport = handlerfactory.getAll(Report);
const getReportById = handlerfactory.getOne(Report);
const updateReport = handlerfactory.updateOne(Report);
const deleteReport = handlerfactory.deleteOne(Report);

module.exports = {
    createReport,
    getReport,
    getReportById,
    updateReport,
    deleteReport,
};