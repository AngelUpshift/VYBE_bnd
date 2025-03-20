const express = require("express");
const { validateToken } = require("../config/token");
const router = express.Router();
const postController = require("../controller/postController");

router.post("/create", validateToken, postController.createPost);
router.get("/", validateToken, postController.getAllPosts);
router.post("/like/:id", validateToken, postController.likePost);
router.post("/unlike/:id", validateToken, postController.unLikePost);
router.post("/save/:id", validateToken, postController.savePost);

module.exports = router;
