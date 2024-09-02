const express = require("express");
const userObj = require("../controllers/userController");
const router = express.Router();
router.post("/register", userObj.createUser);
router.post("/login", userObj.loginUser);
router.post("/logout", userObj.logout);

module.exports = router;
