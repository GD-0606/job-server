const express = require("express");
const router = express.Router();
const applicationInfo = require("../controllers/jobSeekerController");
const { upload, multer } = require("../utils/uploadfiles");
const { verifyUser, checkRole } = require("../middlewares/verifyUser");

router.post(
  "/:Id/jobs/:jobId/apply",
  [verifyUser, checkRole("job_seeker")],
  (req, res, next) => {
    upload.fields([
      { name: "resume", maxCount: 1 },
      { name: "coverLetter", maxCount: 1 },
    ])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            code: "LIMIT_UNEXPECTED_FILE",
            status: false,
            message: err.message,
          });
        } else if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            code: "LIMIT_FILE_COUNT",
            status: false,
            message: err.message,
          });
        } else if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            code: "LIMIT_FILE_SIZE",
            status: false,
            message: err.message,
          });
        }
        return res.status(500).json({
          code: "INTERNAL_SERVER_ERROR",
          status: false,
          message: err.message,
        });
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
        if (err.status === 415) {
          return res.status(400).json({
            code: "BAD_REQUEST",
            status: false,
            message: err.message,
          });
        }
        return res.status(500).json({
          code: "INTERNAL_SERVER_ERROR",
          status: false,
          message: err.message,
        });
      }
      console.log(req.files);
      if (!req.files || !req.files["resume"]) {
        return res.status(400).json({
          code: "BAD_REQUEST",
          status: false,
          message: "Resume is required",
        });
      }
      next();
    });
  },
  applicationInfo.createApplication
);
router.get(
  "/:Id/jobs",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.viewAllJobsListing
);
router.get(
  "/:Id/jobs/:jobId",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.viewJobListing
);
router.get(
  "/:Id/applications",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.viewAllApplicationById
);
router.get(
  "/:Id/applications/:applicationId",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.viewApplicationByIdByApplicationId
);
router.delete(
  "/:Id/applications/:applicationId/withdrawn",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.withDrawApplication
);
// profile management routes

router.get(
  "/:Id",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.getSpecificUserInfo
);
router.put(
  "/:Id",
  [verifyUser, checkRole("job_seeker")],
  applicationInfo.updateUserInfo
);

module.exports = router;
