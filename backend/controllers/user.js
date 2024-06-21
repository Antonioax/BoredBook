const bcrypt = require("bcryptjs");
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
        userName: fetchedUser.username,
        userProfilePhoto: fetchedUser.imagePath,
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

exports.updateUser = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const user = new User({
    _id: req.body.id,
    email: req.body.email,
    username: req.body.username,
    imagePath: req.body.imagePath,
  });
  console.log(user);
  User.updateOne({ _id: req.params.id }, user)
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "User updated succesfully!",
          data: user,
        });
      } else {
        res.status(401).json({
          message: "Couldn't find user!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: error,
      });
    });
};
