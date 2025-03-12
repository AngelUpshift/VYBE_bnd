const userService = require("../service/userService");
const httpStatus = require("http-status");

const register = async (req, res) => {
  const response = await userService.register(req);

  return res.status(response.status).json(response);
};

const login = async (req, res) => {
  const response = await userService.login(req);

  return res.status(response.status).json(response);
};

module.exports = { register, login };
