const express = require("express");
const userRoutes = require("./userRoutes");
const employerRouters = require("./employerRouters");
const jobSeekerRouters = require("./jobSeekerRouters");
const adminRoutes = require("./adminRoutes");

const router = express.Router();
router.use("/api/auth", userRoutes);
router.use("/api/employers", employerRouters);
router.use("/api/job_seekers", jobSeekerRouters);
router.use("/api/admin", adminRoutes);

module.exports = router;
