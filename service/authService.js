const errors = require("../constants/errors");
const User = require("../model/userModel");
const responseService = require("../utils/responseService");
const httpStatus = require("http-status");
const client = require("../config/redis");
const bcrypt = require("bcryptjs");
const email = require("../config/email");

const me = async (request) => {
  try {
    const { user } = request;
    const decodedToken = user;

    const foundUser = await User.findById(decodedToken.id);

    if (!foundUser) {
      return responseService.error(
        "User is not found",
        errors.NOT_EXIST,
        {},
        httpStatus.status.UNAUTHORIZED
      );
    }

    return responseService.success("Successfully found user.", foundUser, {});
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const logout = async (request) => {
  const { user, token } = request;
  const decodedToken = user;
  const tokenExpiration = decodedToken.exp - Math.floor(Date.now() / 1000);

  try {
    await client.setEx(token, tokenExpiration, "blacklisted");

    return responseService.success("Logout successful.", {}, {});
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const changePassword = async (request) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = request.body;
    const { user } = request;
    const userId = user.id;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return responseService.error(
        "User not found.",
        errors.NOT_FOUND,
        {},
        httpStatus.status.NOT_FOUND
      );
    }

    const findCurrentPassword = await bcrypt.compare(
      currentPassword,
      foundUser.password
    );

    if (!findCurrentPassword) {
      return responseService.error(
        "Incorrect password.",
        errors.UNAUTHORIZED,
        {},
        httpStatus.status.UNAUTHORIZED
      );
    }

    if (confirmNewPassword !== newPassword) {
      return responseService.error(
        "Passwords are not matching.",
        errors.BAD_REQUEST,
        {}
      );
    }

    foundUser.password = newPassword;
    foundUser.passwordChangedAt = new Date();
    await foundUser.save();

    return responseService.success(
      "Password changed successfully",
      foundUser,
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

const forgotPassword = async (request) => {
  const { email } = request.body;
  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    return responseService.error(
      "Email address not found.",
      errors.NOT_FOUND,
      {},
      httpStatus.status.NOT_FOUND
    );
  }
};

module.exports = { me, logout, changePassword, forgotPassword };
