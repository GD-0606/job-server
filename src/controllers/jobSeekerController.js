const applicationModel = require("../models/applicationModel");
const jobListingModel = require("../models/jobListingModel");
const userModel = require("../models/userModel");

const path = require("path");

// Apply for a specific job.
const createApplication = async (req, res, next) => {
  const { userId, employerId } = req.body;
  const { jobId } = req.params;
  const resumeFileDetails = { ...req.files["resume"][0] };
  const coverLetterFileDetails = req.files["coverLetter"]
    ? req.files["coverLetter"][0]
    : null;

  // Constructing the image URL
  const resumeImageUrl = `http://localhost:5050/${path.basename(
    resumeFileDetails.path
  )}`;
  // Constructing the image URL
  const coverLetterImageUrl = coverLetterFileDetails
    ? `http://localhost:5050/${path.basename(coverLetterFileDetails.path)}`
    : null;
  const applicationDoc = new applicationModel({
    jobId,
    userId,
    resume: resumeImageUrl,
    coverLetter: coverLetterImageUrl,
    employerId,
  });
  try {
    const findApplication = await applicationModel.findOne({
      userId,
      jobId,
      employerId,
    });
    if (findApplication) {
      return res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: "Already Applied to this Job.",
      });
    }
    await applicationDoc.save();
    res.status(201).json({
      code: "CREATED",
      status: true,
      message: "Application Created Successfully.",
    });
  } catch (error) {
    console.error(error);
    if (
      error.name === "CastError" &&
      (error.path === "jobId" || error.path === "userId")
    ) {
      console.log(error);
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: `Invalid ${error.path}: ${error.value}. Please provide a valid ${error.path}.`,
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

// List all available jobs.
const viewAllJobsListing = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const allJobs = await jobListingModel.find();
    const applications = await applicationModel.find({
      userId: Id,
    });
    console.log("before", allJobs.length);
    if (applications.length > 0) {
      applications.forEach((application, ind) => {
        if (allJobs.length > 0) {
          const index = allJobs.findIndex((job) => {
            if (
              application.jobId.toHexString() === job._id.toHexString() &&
              application.employerId.toHexString() ===
                job.employerId.toHexString()
            ) {
              return true;
            }
          });
          if (index !== -1) {
            allJobs.splice(index, 1);
          }
        }
      });
    }
    console.log("after", allJobs.length);
    res.json({
      code: "OK",
      status: true,
      message: "All Jobs Fetched Successfully.",
      data: allJobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};

// Get details of a specific job posting.
const viewJobListing = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const JobListing = await jobListingModel.findById({
      _id: jobId,
    });
    res.json({
      code: "OK",
      status: true,
      message: "Job Listing Fetched Successfully.",
      data: JobListing,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};

//  List all applications by the job seeker.
const viewAllApplicationById = async (req, res, next) => {
  const { Id } = req.params;
  try {
    let applications = await applicationModel.find({
      userId: Id,
    });
    const modifiedapplications = await Promise.all(
      applications.map(async (application, ind) => {
        const joblisting = await jobListingModel.findOne({
          _id: application.jobId,
          employerId: application.employerId,
        });
        return {
          id: application._id,
          title: joblisting.title,
          description: joblisting.description,
          company: joblisting.company,
          contactInformation: joblisting.contactInformation,
          appliedDate: application.appliedDate,
        };
      })
    );

    res.json({
      code: "OK",
      status: true,
      message: "All Applications Fetched Successfully.",
      data: modifiedapplications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};
// Get details of a specific application.
const viewApplicationByIdByApplicationId = async (req, res, next) => {
  const { Id, applicationId } = req.params;
  try {
    const application = await applicationModel.findOne({
      _id: applicationId,
      userId: Id,
    });
    const joblisting = await jobListingModel.findOne({
      _id: application.jobId,
      employerId: application.employerId,
    });
    console.log(joblisting);

    if (!application || !joblisting) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Application not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "Application Fetched Successfully.",
      data: {
        id: application._id,
        title: joblisting.title,
        appliedDate: application.appliedDate,
        job_status: application.status,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};

// Withdraw an application.
const withDrawApplication = async (req, res, next) => {
  const { Id, applicationId } = req.params;
  try {
    const application = await applicationModel.findOne({
      _id: applicationId,
      userId: Id,
    });
    if (!application) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "Application not found.",
      });
    }
    if (application.status === "withdrawn") {
      return res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: "Application has already been withdrawn",
      });
    }
    application.status = "withdrawn";
    await application.save();
    res.json({
      code: "OK",
      status: true,
      message: "Applications Withdrawn Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};

// Profile Management.

// get specific user info.
const getSpecificUserInfo = async (req, res, next) => {
  const { Id } = req.params;
  try {
    const userInfo = await userModel.findById({
      _id: Id,
    });
    if (!userInfo) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "userInfo not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      messages: "userInfo Fetched Successfully.",
      data: {
        id: userInfo._id,
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      status: false,
      message: "SOMETHING WENT WRONG.",
    });
  }
};
// update the userInfo.
const updateUserInfo = async (req, res, next) => {
  const { Id } = req.params;
  const conditions = {
    _id: Id,
  };
  const obj = {
    $set: {
      ...req.body,
    },
  };
  try {
    const userInfo = await userModel.findOneAndUpdate(conditions, obj, {
      runValidators: true,
    });
    if (!userInfo) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "userInfo not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      messages: "userInfo Updated Successfully.",
    });
  } catch (error) {
    console.log(error);
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
    } else {
      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
  }
};
const applicationInfo = {
  createApplication,
  viewAllJobsListing,
  viewAllApplicationById,
  viewJobListing,
  viewApplicationByIdByApplicationId,
  withDrawApplication,
  getSpecificUserInfo,
  updateUserInfo,
};
module.exports = applicationInfo;
