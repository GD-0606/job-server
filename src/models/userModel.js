const mongoose = require("mongoose");
const argon2 = require("argon2");
const { Schema } = mongoose;
const userSchema = new Schema({
  username: {
    type: String,
    minLength: [3, "Name must be at least 3 characters long"],
    maxLength: [50, "Name cannot be more than 50 characters long"],
    trim: true,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]+(?:[._][a-zA-Z0-9]+)*@gmail.com/.test(value);
      },
      message: (props) => `${props.value} is not validate email`,
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "password must be at least 8 characters long"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["job_seeker", "employer", "admin"],
  },
});
userSchema.pre("save", async function (next) {
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});
// creating an model
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
