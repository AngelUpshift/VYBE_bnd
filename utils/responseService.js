const httpStatus = require("http-status");

const responseService = {
  success(message, data, meta = {}, statusCode = httpStatus.status.OK) {
    return {
      success: true,
      message,
      data,
      meta,
      status: statusCode,
    };
  },

  error(message, error, meta = {}, statusCode = httpStatus.status.BAD_REQUEST) {
    return {
      success: false,
      message,
      error,
      meta,
      status: statusCode,
    };
  },
};

module.exports = responseService;
