const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment, getAllCommentsForPost, getAllCommentsForUser, getAllComments } = require("../controllers/CommentController");


router.get("/reddit/api/comments/all", getAllComments)
router.get("/reddit/api/posts/comments/:id", getAllCommentsForPost)
router.get("/reddit/api/user/comment/:id", getAllCommentsForUser)
router.post("/reddit/api/comment/create", createComment)
router.put("/reddit/api/user/comment/:id", updateComment)
router.delete("/reddit/api/user/comment/:id", deleteComment)


module.exports = router;
