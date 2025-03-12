const jwt = require("jsonwebtoken");
const responseService = require("../utils/responseService");
const errors = require("../constants/errors");
const httpStatus = require("http-status");
const client = require("../config/redis");
require("dotenv").config();

const createToken = (user) => {
  const token = jwt.sign(
    {
      username: user.username,
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
};

const validateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    const response = responseService.error(
      "Token not present",
      errors.UNAUTHORIZED,
      {},
      httpStatus.status.UNAUTHORIZED
    );
    return res.status(response.status).json(response);
  }

  try {
    const reply = await client.get(token);

    if (reply === "blacklisted") {
      const response = responseService.error(
        "Token is invalidated.",
        errors.UNAUTHORIZED,
        {},
        httpStatus.UNAUTHORIZED
      );
      return res.status(response.status).json(response);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    req.token = token;
    next();
  } catch (error) {
    let response;
    if (error.name === "JsonWebTokenError") {
      response = responseService.error(
        "Failed authentication",
        errors.FORBIDDEN,
        {},
        httpStatus.FORBIDDEN
      );
    } else {
      response = responseService.error(
        "Internal server error.",
        errors.SERVER_ERROR,
        {},
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return res.status(response.status).json(response);
  }
};

module.exports = { createToken, validateToken };
