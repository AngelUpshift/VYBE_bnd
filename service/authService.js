const errors = require("../constants/errors");
const User = require("../model/userModel");
const responseService = require("../utils/responseService");
const httpStatus = require("http-status");
const client = require("../config/redis");
const bcrypt = require("bcryptjs");
const sendEmail = require("../config/email");
const crypto = require("crypto");
const { userResponseObject } = require("../utils/ResponseObject");

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

    return responseService.success(
      "Successfully found user.",
      userResponseObject(foundUser),
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
      userResponseObject(foundUser),
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

  const resetToken = foundUser.createRandomResetToken();
  await foundUser.save({ validateBeforeSave: false });
  // for development
  // const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // for testing
  const url = `http://localhost:5000/v1/auth/reset-password/${resetToken}`;

  const message = `Dear Angel\n\nWe have received a request to reset your password. Please click the link below to proceed with resetting your password\n\n${url}\n\nIf you did not request a password reset, please ignore this email or contact our support team for assistance.\n\nThank you,\nVybe Support Team`;

  const options = {
    email: foundUser.email,
    subject: "password resseting",
    message: message,
  };
  try {
    await sendEmail(options);

    return responseService.success(
      "Mail sent successfully",
      userResponseObject(foundUser),
      {}
    );
  } catch (error) {
    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetTokenExpireAt = undefined;

    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

const resetPassword = async (request) => {
  const { token } = request.params;
  const { newPassword, confirmNewPassword } = request.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const validUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpireAt: { $gt: Date.now() },
  });

  if (!validUser) {
    return responseService.error(
      "Token is not valid.",
      errors.NOT_EXIST,
      {},
      httpStatus.status.NOT_FOUND
    );
  }

  if (newPassword !== confirmNewPassword) {
    return responseService.error(
      "Passwords are not matching.",
      errors.BAD_REQUEST,
      {}
    );
  }

  validUser.password = newPassword;
  validUser.passwordResetToken = undefined;
  validUser.passwordResetTokenExpireAt = undefined;
  validUser.passwordChangedAt = Date.now();

  try {
    await validUser.save();
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }

  return responseService.success(
    "Successful password reset.",
    userResponseObject(validUser),
    {}
  );
};

module.exports = {
  me,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
