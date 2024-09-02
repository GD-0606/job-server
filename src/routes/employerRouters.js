const express = require("express");
const router = express.Router();
const jobsInfo = require("../controllers/jobListingController");
const employerInfo = require("../controllers/employerController");
const { verifyUser, checkRole } = require("../middlewares/verifyUser");

router.post(
  "/:Id/jobs",
  [verifyUser, checkRole("employer")],
  jobsInfo.createJob
);
router.put(
  "/:Id/jobs/:jobId",
  [verifyUser, checkRole("employer")],
  jobsInfo.updateJob
);
router.delete(
  "/:Id/jobs/:jobId",
  [verifyUser, checkRole("employer")],
  jobsInfo.deleteJob
);
router.get(
  "/:Id/jobs/:jobId",
  [verifyUser, checkRole("employer")],
  jobsInfo.getJobById
);
router.get(
  "/:Id/jobs",
  [verifyUser, checkRole("employer")],
  jobsInfo.getJobListingByEmployerId
);
// Applications Routes
router.get(
  "/:Id/applications",
  [verifyUser, checkRole("employer")],
  employerInfo.getAllApplicationsByEmployerId
);
router.get(
  "/:Id/applications/:applicationId",
  [verifyUser, checkRole("employer")],
  employerInfo.getApplicationByEmployerIdByApplicationId
);
router.put(
  "/:Id/applications/:applicationId",
  [verifyUser, checkRole("employer")],
  employerInfo.updateApplicationByEmployerIdByApplicationId
);
router.get(
  "/:Id/jobs/:jobId/applications",
  [verifyUser, checkRole("employer")],
  employerInfo.getAllApplicationsByEmployerIdByJobId
);

module.exports = router;
