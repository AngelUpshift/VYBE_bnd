const errors = require("../constants/errors");
const Post = require("../model/postModel");
const User = require("../model/userModel");
const responseService = require("../utils/responseService");
const httpStatus = require("http-status");

const createPost = async (request) => {
  const { user } = request;
  const { content, media } = request.body;
  const targetedUser = await User.findById(user.id);

  const post = {
    user: user.id,
    content: content,
    media: media,
  };

  const createdPost = await Post.create(post);
  targetedUser.posts.push(createdPost.id);
  await targetedUser.save();

  if (!createdPost || !targetedUser) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
  return responseService.success(
    "Successfully posted",
    createdPost,
    {},
    httpStatus.status.CREATED
  );
};

const getAllPosts = async () => {
  const posts = await Post.find();

  if (!posts) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
  return responseService.success("Fetched all posts", posts, {});
};

const likePost = async (request) => {
  const { id } = request.params;
  const { user } = request;

  try {
    const targetedPost = await Post.findOne({
      _id: { $eq: id },
      likes: { $nin: [user.id] },
    });
    const targetedUser = await User.findById(user.id);

    if (!targetedPost) {
      return responseService.error(
        "Post not found or already liked",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    targetedPost.likes.push(user.id);
    targetedUser.likedPosts.push(targetedPost.id);
    await targetedPost.save();
    await targetedUser.save();

    return responseService.success("Successfully liked post", targetedPost, {});
  } catch (error) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const unLikePost = async (request) => {
  const { id } = request.params;
  const { user } = request;

  try {
    const targetedPost = await Post.findOne({
      _id: { $eq: id },
      likes: { $in: [user.id] },
    });
    const targetedUser = await User.findById(user.id);

    if (!targetedPost || !targetedUser) {
      return responseService.error(
        "Post not found or is already not liked",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    targetedPost.likes = targetedPost.likes.filter(
      (id) => id.toString() !== user.id
    );
    targetedUser.likedPosts = targetedUser.likedPosts.filter(
      (id) => id.toString() !== targetedPost.id
    );

    await targetedPost.save();
    await targetedUser.save();

    return responseService.success(
      "Successfully un-liked post",
      targetedPost,
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

const savePost = async (request) => {
  const { id } = request.params;
  const { user } = request;

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

    targetedUser.savedPosts.push(targetedPost.id);
    await targetedUser.save();

    return responseService.success("Post saved", targetedPost, {});
  } catch (error) {
    return responseService.error(
      "Internal server error",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { createPost, getAllPosts, likePost, unLikePost, savePost };
