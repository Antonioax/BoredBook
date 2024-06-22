const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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
  let newImagePath = req.body.imagePath;
  let oldImagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    newImagePath = url + "/images/" + req.file.filename;
  }

  console.log(req.body);

  User.findById(req.body.id).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (req.file && user.imagePath) {
      oldImagePath = path.join(
        __dirname,
        "..",
        "images",
        path.basename(user.imagePath)
      );
    }

    const updatedUser = new User({
      _id: req.body.id,
      email: req.body.email,
      username: req.body.username,
      imagePath: newImagePath || user.imagePath,
    });

    User.findOne({ username: req.body.username }).then((existingUser) => {
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({
          message: "Username already exists!",
        });
      }

      User.updateOne({ _id: req.params.id }, updatedUser)
        .then((result) => {
          console.log(result);
          if (result.matchedCount > 0) {
            if (oldImagePath) {
              fs.unlink(oldImagePath, (err) => {
                if (err) {
                  console.error("Failed to delete old image:", err);
                }
              });
            }
            res.status(200).json({
              message: "User updated succesfully!",
              data: updatedUser,
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
    });
  });
};
