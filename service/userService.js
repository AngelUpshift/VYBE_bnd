const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { createToken } = require("../config/token");
const responseService = require("../utils/responseService");
const errors = require("../constants/errors");
const httpStatus = require("http-status");
const userResponseObject = require("../utils/userResponseObject");

const register = async (request) => {
  try {
    const {
      username,
      password,
      fullName,
      email,
      gender,
      dateOfBirth,
      location,
    } = request.body;

    const sameUsername = await User.findOne({ username: { $eq: username } });
    const sameEmail = await User.findOne({ email: { $eq: email } });

    if (sameUsername || sameEmail) {
      return responseService.error(
        "Duplicate credentials.",
        errors.DUPLICATE,
        {},
        httpStatus.status.CONFLICT
      );
    }

    const user = await User.create(request.body);

    return responseService.success(
      "Register succesful",
      userResponseObject(user),
      {},
      httpStatus.status.CREATED
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

const login = async (request) => {
  try {
    const { username, password } = request.body;

    const usernameExists = await User.findOne({ username: username });

    if (!usernameExists) {
      return responseService.error(
        "Invalid username",
        errors.NOT_EXIST,
        {},
        httpStatus.status.UNAUTHORIZED
      );
    }

    const arePasswordsEqual = await bcrypt.compare(
      password,
      usernameExists.password
    );

    if (!arePasswordsEqual) {
      return responseService.error(
        "Invalid password",
        errors.NOT_EXIST,
        {},
        httpStatus.status.UNAUTHORIZED
      );
    }

    const access_token = createToken(usernameExists);

    return responseService.success("Successful login", access_token);
  } catch (error) {
    return responseService.error(
      "Internal server error.",
      errors.SERVER_ERROR,
      {},
      httpStatus.status.INTERNAL_SERVER_ERROR
    );
  }
};

module.exports = { register, login };
