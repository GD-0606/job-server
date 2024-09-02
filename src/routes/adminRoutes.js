const express = require("express");
const router = express.Router();
const adminInfo = require("../controllers/adminController");
const { verifyUser, checkRole } = require("../middlewares/verifyUser");
router.get(
  "/:Id/users",
  [verifyUser, checkRole("admin")],
  adminInfo.getAllUsers
);
router.get(
  "/:Id/users/:userId",
  [verifyUser, checkRole("admin")],
  adminInfo.getUserInfo
);
router.put(
  "/:Id/users/:userId",
  [verifyUser, checkRole("admin")],
  adminInfo.updateUserInfo
);
router.delete(
  "/:Id/users/:userId",
  [verifyUser, checkRole("admin")],
  adminInfo.deleteUserInfo
);

module.exports = router;
