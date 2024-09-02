const userValidation = (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  next();
};
module.exports = userValidation;
