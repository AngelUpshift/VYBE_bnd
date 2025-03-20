const express = require("express");
const { validateToken } = require("../config/token");
const router = express.Router();
const commentController = require("../controller/commentController");

router.post(
  "/comment-post/:id",
  validateToken,
  commentController.commentOnPost
);
router.post(
  "/reply-to-comment/:id",
  validateToken,
  commentController.replyToComment
);

module.exports = router;
