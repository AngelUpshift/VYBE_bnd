const commentService = require("../service/commentService");

const commentOnPost = async (req, res) => {
  const response = await commentService.commentOnPost(req);

  return res.status(response.status).json(response);
};

const replyToComment = async (req, res) => {
  const response = await commentService.replyToComment(req);

  return res.status(response.status).json(response);
};

module.exports = { commentOnPost, replyToComment };
