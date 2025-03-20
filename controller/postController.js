const postService = require("../service/postService");

const createPost = async (req, res) => {
  const response = await postService.createPost(req);

  return res.status(response.status).json(response);
};

const getAllPosts = async (req, res) => {
  const response = await postService.getAllPosts();

  return res.status(response.status).json(response);
};

const likePost = async (req, res) => {
  const response = await postService.likePost(req);

  return res.status(response.status).json(response);
};

const unLikePost = async (req, res) => {
  const response = await postService.unLikePost(req);

  res.status(response.status).json(response);
};

const savePost = async (req, res) => {
  const response = await postService.savePost(req);

  res.status(response.status).json(response);
};

module.exports = { createPost, getAllPosts, likePost, unLikePost, savePost };
