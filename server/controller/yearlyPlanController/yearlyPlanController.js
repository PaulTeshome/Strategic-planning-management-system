// multer
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");
const APIError = require("../../utils/apiError");
const catchAsync = require("../../utils/catchAsync");
const { fileUpload } = require("../../utils/fileUpload");
const { YearlyPlan } = require("../../models/yearly.plan.model");
const { getOne, getAll } = require("../handlerFactory");


// upload location
const upload = multer({ dest: "../../public/uploads/" });

exports.uploadYearlyPlan = catchAsync(async (req, res, next) => {
    const file = req.files.file;
    // extract the userid and year from the request body

    const userId = req.user.id;
    const year  = req.body.year


    // save the file in upload folder
    const savedFile = await fileUpload({file, filePath:"yearlyPlan", name: "yearlyPlan-" + year, maxSize: 2000000});

    if (savedFile instanceof APIError) {
        return next(savedFile);
    }



    // save on the database
    const yearlyPlan = await YearlyPlan.create({
        filename: savedFile,
        file: savedFile.path,
        year: year,
        approvedBy: userId,
    });

    res.status(201).json({
        status: "success",
        data: {
            yearlyPlan: yearlyPlan,
        },
    });
})


exports.getYearlyPlan = getOne(YearlyPlan)
exports.getAllYearlyPlan = getAll(YearlyPlan)