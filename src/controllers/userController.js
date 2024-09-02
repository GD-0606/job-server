const userModel = require("../models/userModel");
const argon2 = require("argon2");

// create the users
const createUser = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  const userDoc = new userModel({ username, email, password, role });

  try {
    await userDoc.save();
    res.status(201).json({
      code: "CREATED",
      status: true,
      message: "User Created Successfully.",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      let errorMessage = {};
      for (const field in error.errors) {
        console.log(error.errors[field]);
        errorMessage[field] = error.errors[field].message;
      }
      res.status(400).json({
        code: "BAD_REQUEST",
        status: false,
        message: "Validation Error",
        data: errorMessage,
      });
    } else if (error.code === 11000) {
      console.log(error);
      res.status(409).json({
        code: "CONFLICT",
        status: false,
        message: `${error.keyValue["email"]} is already exists`,
      });
    } else {
      console.log(error);
      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
  }
};

// login the user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // check the user
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return res.status(404).json({
        code: "NOT_FOUND",
        status: false,
        message: "User Does Not Exist",
      });
    }
    // check the password match.
    const isMatch = await argon2.verify(findUser.password, password);
    if (!isMatch) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        status: false,
        message: "Invalid Credentials",
      });
    }
    req.session.userInfo = {
      id: findUser._id.toHexString(),
      username: findUser.username,
      email: findUser.email,
      role: findUser.role,
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).send("Failed to save session");
      }
    });

    res.json({
      code: "OK",
      status: true,
      message: "ok",
      data: {
        id: findUser._id.toHexString(),
        username: findUser.username,
        email: findUser.email,
        role: findUser.role,
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

//logout the user
const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
    res.clearCookie("session_id");
    res.json({ code: "OK", status: true, message: "Logout successful" });
  });
};

const userObj = {
  createUser,
  loginUser,
  logout,
};
module.exports = userObj;
