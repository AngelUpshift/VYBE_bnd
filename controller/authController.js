const { response } = require("express");
const jwt = require("jsonwebtoken");
const authService = require("../service/authService");

const me = async (req, res) => {
  const response = await authService.me(req);

  return res.status(response.status).json(response);
};

const logout = async (req, res) => {
  const response = await authService.logout(req);

  return res.status(response.status).json(response);
};

const changePassword = async (req, res) => {
  const response = await authService.changePassword(req);

  return res.status(response.status).json(response);
};

const forgotPassword = async (req, res) => {
  const response = await authService.forgotPassword(req);

  return res.status(response.status).json(response);
};

const resetPassword = async (req, res) => {
  const response = await authService.resetPassword(req);

  return res.status(response.status).json(response);
};

module.exports = { me, logout, changePassword, forgotPassword, resetPassword };
