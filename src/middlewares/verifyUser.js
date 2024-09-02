const userModel = require("../models/userModel");
const verifyUser = (req, res, next) => {
  const { Id } = req.params;
  console.log(req.session.userInfo);
  if (!req.session.userInfo) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      status: false,
      message: "Provide Valid Id.",
    });
  }
  const { id } = req.session?.userInfo;
  console.log(id);
  if (id === Id) {
    next();
  } else {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      status: false,
      message: "Provide Valid Id.",
    });
  }
};
const checkRole = (role) => {
  return async (req, res, next) => {
    const { id } = req.session?.userInfo;
    try {
      const findUser = await userModel.findOne({
        _id: id,
      });
      if (findUser?.role !== role) {
        return res.status(403).json({
          code: "FORBIDDEN",
          status: false,
          message: "Access denied.",
        });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        status: false,
        message: "SOMETHING WENT WRONG.",
      });
    }
  };
};

module.exports = { verifyUser, checkRole };
