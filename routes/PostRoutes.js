const express = require("express");
const router = express.Router();
const upload = require("../middleware/FileUpload");
const { createPost, getSinglePost, getAllPosts, getPostsByUser, deletePost, updatePost, votePost  } = require("../controllers/PostController");
const uploadMiddleware = require("../utils/upload");


router.get("/reddit/api/posts/all", getAllPosts)
router.get("/reddit/api/posts/user/:id", getPostsByUser)
router.get("/reddit/api/posts/:id", getSinglePost)
router.post("/reddit/api/posts/create", uploadMiddleware, createPost);
router.put("/reddit/api/posts/edit/:id", uploadMiddleware, updatePost);
router.delete("/reddit/api/posts/delete/:id", deletePost)
router.put("/reddit/api/posts/:postId/vote", votePost )



module.exports = router;
