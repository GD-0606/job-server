const mongoose = require("mongoose");
const { Schema } = mongoose;
const jobListingSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "title is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "description is required"],
    },
    company: {
      type: String,
      trim: true,
      required: [true, "company name is required"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "location is required"],
    },
    salary: {
      type: String,
      trim: true,
      required: [true, "salary is required"],
    },
    tags: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "tags is required"],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value) || value.length === 0) {
            return false;
          }
          return value.every(
            (tag) => typeof tag === "string" && tag.trim().length > 0
          );
        },
        message: (props) => {
          return "tags must be a non-empty array of non-empty strings";
        },
      },
    },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "skills is required"],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value) || value.length === 0) {
            return false;
          }
          return value.every(
            (tag) => typeof tag === "string" && tag.trim().length > 0
          );
        },
        message: (props) => {
          return "skills must be a non-empty array of non-empty strings";
        },
      },
    },
    jobType: {
      type: String,
      trim: true,
      required: [true, "jobType is required"],
    },
    experienceLevel: {
      type: String,
      trim: true,
      required: [true, "experienceLevel is required"],
    },
    postedDate: {
      type: String,
      trim: true,
      required: [true, "postedDate is required"],
    },
    applicationDeadline: {
      type: String,
      trim: true,
      required: [true, "applicationDeadline is required"],
    },
    educationRequirements: {
      type: String,
      trim: true,
      required: [true, "educationRequirements is required"],
    },
    benefits: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "benefits is required"],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value) || value.length === 0) {
            return false;
          }
          return value.every(
            (tag) => typeof tag === "string" && tag.trim().length > 0
          );
        },
        message: (props) => {
          return "benefits must be a non-empty array of non-empty strings";
        },
      },
    },
    contactInformation: {
      type: String,
      trim: true,
      required: [true, "contactInformation is required"],
    },
    companyWebsite: {
      type: String,
      trim: true,
      required: [true, "companyWebsite is required"],
    },
    industry: {
      type: String,
      trim: true,
      required: [true, "industry is required"],
    },
    workSchedule: {
      type: String,
      trim: true,
      required: [true, "workSchedule is required"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

// create the model
const jobListingModel = mongoose.model("joblistings", jobListingSchema);

module.exports = jobListingModel;
