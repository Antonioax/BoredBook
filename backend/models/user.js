const mongoose = require("mongoose");
const mongooseValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  imagePath: { type: String },
});

userSchema.plugin(mongooseValidator);

module.exports = mongoose.model("User", userSchema);
