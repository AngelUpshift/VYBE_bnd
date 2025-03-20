const errors = require("../constants/errors");
const Comment = require("../model/commentModel");
const Post = require("../model/postModel");
const User = require("../model/userModel");
const responseService = require("../utils/responseService");
const httpStatus = require("http-status");

const commentOnPost = async (request) => {
  const { id } = request.params;
  const { user } = request;
  const { content } = request.body;

  try {
    const targetedPost = await Post.findById(id);
    const targetedUser = await User.findById(user.id);

    if (!targetedPost || !targetedUser) {
      return responseService.error(
        "Post or User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    const comment = {
      content: content,
      user: user.id,
      post: targetedPost.id,
    };

    const createdComment = await Comment.create(comment);
    targetedPost.comments.push(createdComment.id);
    targetedPost.save();

    return responseService.success(
      "Successfully comented on the post",
      createdComment,
      {},
      httpStatus.status.CREATED
    );
  } catch (error) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const replyToComment = async (request) => {
  const { id } = request.params;
  const { user } = request;
  const { content } = request.body;

  try {
    const targetedComment = await Comment.findById(id);
    const targetedUser = await User.findById(user.id);
    const targetedPost = await Post.findById(
      targetedComment.post._id.toString()
    );

    if (!targetedPost || !targetedUser || !targetedComment) {
      return responseService.error(
        "Post, Comment or User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    const comment = {
      content: content,
      user: targetedUser.id,
      post: targetedPost.id,
    };

    const createdComment = await Comment.create(comment);

    targetedComment.replies.push(createdComment.id);
    targetedPost.comments.push(createdComment.id);

    await targetedComment.save();
    await targetedPost.save();

    return responseService.success(
      "Successfully replied to another comment",
      createdComment,
      {}
    );
  } catch (error) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { commentOnPost, replyToComment };
