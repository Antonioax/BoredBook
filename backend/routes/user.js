const express = require("express");
const extractFile = require("../middlewares/files");
const router = express.Router();

const UserController = require("../controllers/user");

router.post("/signup", UserController.createUser);

router.post("/login", UserController.loginUser);

router.put("/:id", extractFile, UserController.updateUser);

module.exports = router;
