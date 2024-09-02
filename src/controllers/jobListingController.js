const jobListingModel = require("../models/jobListingModel");

// Create a job posting.
const createJob = async (req, res, next) => {
  try {
    const jobDoc = new jobListingModel({ ...req.body });
    await jobDoc.save();
    res.status(201).json({
      code: "CREATED",
      status: true,
      message: "Job Created Successfully.",
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
    } else {
      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
  }
};

// Updating a job posting.
const updateJob = async (req, res, next) => {
  const { Id, jobId } = req.params;
  const conditions = {
    _id: jobId,
    employerId: Id,
  };
  const obj = {
    $set: {
      ...req.body,
    },
  };
  try {
    const updatedDoc = await jobListingModel.findOneAndUpdate(conditions, obj, {
      runValidators: true,
      new: true,
    });
    if (!updatedDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Job listing not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Job listing updated successfully.",
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

// Delete a job posting.
const deleteJob = async (req, res, next) => {
  const { Id, jobId } = req.params;
  const conditions = {
    _id: jobId,
    employerId: Id,
  };
  try {
    const deleteDoc = await jobListingModel.findOneAndDelete(conditions, {
      new: true,
    });
    if (!deleteDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Job listing not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Job listing deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError" && error.path === "_id") {
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
// Get details of a specific job posting.
const getJobById = async (req, res, next) => {
  const { Id, jobId } = req.params;
  const conditions = {
    _id: jobId,
    employerId: Id,
  };
  try {
    const findDoc = await jobListingModel.findOne(conditions);
    if (!findDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Job listing not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Job listing fetched successfully.",
      data: findDoc,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError" && error.path === "_id") {
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

// List all job postings.
const getJobListingByEmployerId = async (req, res, next) => {
  const { Id } = req.params;
  const conditions = {
    employerId: Id,
  };
  try {
    const findDoc = await jobListingModel.find(conditions);
    if (!findDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Job listing not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Jobs listing fetched successfully.",
      data: findDoc,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError" && error.path === "_id") {
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
const jobsInfo = {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getJobListingByEmployerId,
};
module.exports = jobsInfo;
