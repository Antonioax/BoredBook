const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
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
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creatorId: req.userData.userId,
    creatorEmail: req.userData.email,
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id, creatorId: req.userData.userId }, post)
    .then((result) => {
      console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: "Post updated succesfully!",
        });
      } else {
        res.status(401).json({
          message: "You are not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post update failed!",
      });
    });
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
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id,
    creatorId: req.userData.userId,
  })
    .then((result) => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Post deleted succesfully!",
        });
      } else {
        res.status(401).json({
          message: "You are not authorized!",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post delete failed!",
      });
    });
};
