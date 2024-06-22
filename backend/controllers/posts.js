const fs = require("fs");
const path = require("path");

const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(url);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creatorId: req.userData.userId,
    creatorEmail: req.userData.email,
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post added succesfully!",
        post: {
          id: result._id,
          title: result.title,
          content: result.content,
          imagePath: result.imagePath,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post create failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  try {
    let newImagePath;
    let oldImagePath;

    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      newImagePath = url + "/images/" + req.file.filename;
    }

    Post.findById(req.params.id).then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post not found!" });
      }

      if (post.creatorId.toString() !== req.userData.userId.toString()) {
        return res.status(401).json({ message: "You are not authorized!" });
      }

      if (req.file) {
        oldImagePath = path.join(
          __dirname,
          "..",
          "images",
          path.basename(post.imagePath)
        );
      }

      const updatedPost = {
        title: req.body.title,
        content: req.body.content,
        imagePath: newImagePath || post.imagePath,
        creatorId: req.userData.userId,
        creatorEmail: req.userData.email,
      };

      Post.updateOne(
        { _id: req.params.id, creatorId: req.userData.userId },
        updatedPost
      ).then((result) => {
        if (result.matchedCount > 0) {
          if (oldImagePath) {
            fs.unlink(oldImagePath, (err) => {
              if (err) {
                console.error("Failed to delete old image:", err);
              }
            });
          }
          res.status(200).json({ message: "Post updated successfully!" });
        } else {
          res.status(401).json({ message: "You are not authorized!" });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Post update failed!" });
  }
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments({});
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully!",
        posts: fetchedPosts,
        postCount: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post fetch failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post fetch failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found!",
        });
      }

      return Post.deleteOne({
        _id: req.params.id,
        creatorId: req.userData.userId,
      }).then((result) => {
        console.log(result);
        if (result.deletedCount > 0) {
          const imagePath = path.join(
            __dirname,
            "..",
            "images",
            path.basename(post.imagePath)
          );
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Failed to delete image:", err);
            }
          });

          res.status(200).json({ message: "Post deleted successfully!" });
        } else {
          res.status(401).json({ message: "You are not authorized!" });
        }
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Post delete failed!" });
    });
};
