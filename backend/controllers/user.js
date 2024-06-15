const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.loginUser = (req, res, next) => {
  let fetchedUser;
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(401).json({
          message: "Authentication failed!",
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication failed!",
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return res.status(200).json({
        message: "Authentication successfull!",
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userEmail: fetchedUser.email,
      });
    })
    .catch((err) => {
      if (!res.headersSent) {
        res
          .status(500)
          .json({ message: "Invalid authentication credentials!" });
      }
    });
};
