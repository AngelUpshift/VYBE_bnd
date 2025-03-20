const User = require("../model/userModel");
const Notification = require("../model/notificationModel");
const httpStatus = require("http-status");
const { notificationTypes } = require("../config/roles");
const responseService = require("../utils/responseService");
const {
  userResponseObject,
  notificationResponseObject,
} = require("../utils/ResponseObject");
const errors = require("../constants/errors");

const followRequest = async (request) => {
  const { id } = request.params;
  const { user } = request;
  try {
    const loggedUser = await User.findById(user.id);
    const findUser = await User.findById(id);

    if (!findUser || !loggedUser) {
      return responseService.error(
        "User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    if (findUser.isPrivate) {
      findUser.followRequests.push(loggedUser.id);
      await findUser.save();

      const notification = new Notification({
        user: findUser.id,
        type: notificationTypes.FOLLOW_REQUEST,
        sender: loggedUser.id,
        content: `${loggedUser.username} sent you a follow request.`,
        link: `profile/${loggedUser.id}`,
      });

      await notification.save();

      return responseService.success(
        "Follow request sent",
        notificationResponseObject(notification),
        {}
      );
    } else {
      findUser.followers.push(loggedUser.id);
      loggedUser.following.push(findUser.id);
      await findUser.save();
      await loggedUser.save();

      const notification = new Notification({
        user: findUser.id,
        type: notificationTypes.FOLLOW_REQUEST,
        sender: loggedUser.id,
        content: `${loggedUser.username} followed you.`,
        link: `profile/${loggedUser.id}`,
      });
      await notification.save();

      return responseService.success(
        "Followed successfully",
        notificationResponseObject(notification),
        {}
      );
    }
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const acceptFollowRequests = async (request) => {
  const { id } = request.params;
  const { user } = request;

  try {
    const loggedUser = await User.findById(user.id);
    const findUser = await User.findById(id);

    if (!findUser || !loggedUser) {
      return responseService.error(
        "User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    loggedUser.followRequests = loggedUser.followRequests.filter(
      (id) => id.toString() !== findUser.id
    );

    loggedUser.followers.push(findUser.id);
    findUser.following.push(loggedUser.id);
    await loggedUser.save();
    await findUser.save();

    const notification = new Notification({
      user: findUser.id,
      type: notificationTypes.FOLLOW_REQUEST,
      sender: loggedUser.id,
      content: `${loggedUser.username} accepted your follow request.`,
      link: `profile/${loggedUser.id}`,
    });

    await notification.save();

    return responseService.success(
      "Follow request accepted",
      notificationResponseObject(notification),
      {}
    );
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const declineFollowRequests = async (request) => {
  const { id } = request.params;
  const { user } = request;

  try {
    const loggedUser = await User.findById(user.id);
    const findUser = await User.findById(id);

    if (!findUser || !loggedUser) {
      return responseService.error(
        "User not found",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    loggedUser.followRequests = loggedUser.followRequests.filter(
      (id) => id.toString() !== findUser.id
    );

    await loggedUser.save();

    return responseService.success(
      "Follow request declined",
      userResponseObject(loggedUser),
      {}
    );
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = {
  followRequest,
  acceptFollowRequests,
  declineFollowRequests,
};
