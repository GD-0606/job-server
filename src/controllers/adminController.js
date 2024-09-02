const userModel = require("../models/userModel");
const jobListingModel = require("../models/jobListingModel");
const applicationModel = require("../models/applicationModel");

// Users Management

//Get a list of all users.
const getAllUsers = async (req, res, next) => {
  try {
    const usersList = await userModel.find();
    const modified_userList = usersList.map((user, ind) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
    });
    res.json({
      code: "OK",
      status: true,
      message: "usersList Fetched Successfully.",
      data: modified_userList,
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
//Get details of a specific user.
const getUserInfo = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userList = await userModel.findOne({
      _id: userId,
    });
    if (!userList) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "User not found.",
      });
    }
    const { _id, username, email, role } = userList;
    res.json({
      code: "OK",
      status: true,
      message: "usersList Fetched Successfully.",
      data: {
        id: _id,
        username,
        email,
        role,
      },
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

//Update a user's information.
const updateUserInfo = async (req, res, next) => {
  const { userId } = req.params;
  const conditions = {
    _id: userId,
  };
  const obj = {
    $set: {
      ...req.body,
    },
  };
  try {
    const updatedDoc = await userModel.findOneAndUpdate(conditions, obj, {
      runValidators: true,
      new: true,
    });
    if (!updatedDoc) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "user not found.",
      });
    }
    res.json({
      code: "OK",
      status: true,
      message: "userInfo updated successfully.",
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
        message: `Invalid user ID: ${error.value}. Please provide a valid user ID.`,
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
//Delete a user.
const deleteUserInfo = async (req, res, next) => {
  const { userId } = req.params;
  const conditions = {
    _id: userId,
  };
  try {
    const getUserInfo = await userModel.findOne(conditions);
    if (!getUserInfo) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "user not found.",
      });
    }
    const { role } = getUserInfo;

    if (role === "employer") {
      await jobListingModel.deleteMany({
        employerId: userId,
      });
      await applicationModel.deleteMany({
        employerId: userId,
      });
    } else if (role === "job_seeker") {
      await applicationModel.deleteMany({
        userId: userId,
      });
    }
    await userModel.findOneAndDelete(conditions);
    res.json({
      code: "OK",
      status: true,
      message: "userInfo deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "CastError" && error.path === "_id") {
      console.log(error);
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: `Invalid user ID: ${error.value}. Please provide a valid user ID.`,
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
//2. **Job Management**
//Get a list of all job postings.
//Get details of a specific job posting.
//Create a new job posting.
//Update a job posting.
//Delete a job posting.

// **Application Management**
//Get a list of all job applications.
//Get details of a specific job application.
//Update the status of a job application.
// Delete a job application.

const adminInfo = {
  getAllUsers,
  getUserInfo,
  updateUserInfo,
  deleteUserInfo,
};
module.exports = adminInfo;
