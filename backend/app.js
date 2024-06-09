const express = require("express");
const bodyParser = require("body-parser");

const Post = require("./models/post");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({
    message: "Post added succesfully!",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "ijjoiji44iji",
      title: "Post from server",
      content: "Node and Express said HI.",
    },
    {
      id: "gthzjuk8iuz5",
      title: "Post from server numero dos",
      content:
        "Por que no bebidas vino con tus amigos pero miras tu computadora todos los dias?",
    },
  ];
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: posts,
  });
});

module.exports = app;
