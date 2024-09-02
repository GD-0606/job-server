const applicationModel = require("../models/applicationModel");

// List All Applications for a Specific Employer
const getAllApplicationsByEmployerId = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const applications = await applicationModel.find({ employerId: Id });
    res.json({
      code: "OK",
      status: true,
      message: "All Applications Fetched Successfully.",
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};

//List all applications for a specific job posted by the employer.
const getAllApplicationsByEmployerIdByJobId = async (req, res, next) => {
  const { Id, jobId } = req.params;
  try {
    const applications = await applicationModel.find({ employerId: Id, jobId });
    res.json({
      code: "OK",
      status: true,
      message: "All Applications Fetched Successfully.",
      data: applications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};


// Get details of a specific application.
const getApplicationByEmployerIdByApplicationId = async (req, res, next) => {
  const { Id, applicationId } = req.params;
  try {
    const application = await applicationModel.findOne({
      _id: applicationId,
      employerId: Id,
    });
    res.json({
      code: "OK",
      status: true,
      message: "All Application Fetched Successfully.",
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};


// Update the status of an application
const updateApplicationByEmployerIdByApplicationId = async (req, res, next) => {
  const { Id, applicationId } = req.params;
  const conditions = {
    _id: applicationId,
    employerId: Id,
  };
  const obj = {
    $set: {
      ...req.body,
    },
  };
  try {
    const updatedDoc = await applicationModel.findOneAndUpdate(
      conditions,
      obj,
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Application not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Application Updated Successfully.",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      let errorMessage = {};
      for (const field in error.errors) {
        errorMessage[field] = error.errors[field].message;
      }
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: "Validation Error",
        data: errorMessage,
      });
    } else if (error.name === "StrictModeError") {
      console.log(error);
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: `Strict Mode Error: Unknown field name:${error.path} found.`,
      });
    } else if (error.name === "CastError" && error.path === "_id") {
      console.log(error);
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: `Invalid Job ID: ${error.value}. Please provide a valid Job ID.`,
      });
    } else {
      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
  }
};


const employerInfo = {
  getAllApplicationsByEmployerId,
  getAllApplicationsByEmployerIdByJobId,
  getApplicationByEmployerIdByApplicationId,
  updateApplicationByEmployerIdByApplicationId,
};


module.exports = employerInfo;
