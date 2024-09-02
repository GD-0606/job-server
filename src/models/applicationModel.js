const mongoose = require("mongoose");
const { Schema } = mongoose;
const applicationSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "joblistings",
      required: [true, "jobId is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "userId is required"],
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "employerId is required"],
    },
    resume: {
      type: String,
      required: true,
    },
    coverLetter: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    appliedDate: {
      type: Date,
      default: new Date().toISOString(),
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  }
);

const applicationModel = mongoose.model("applications", applicationSchema);
module.exports = applicationModel;
