const notificationService = require("../service/notificationService");

const followRequest = async (req, res) => {
  const response = await notificationService.followRequest(req);

  return res.status(response.status).json(response);
};

const acceptFollowRequest = async (req, res) => {
  const response = await notificationService.acceptFollowRequests(req);

  return res.status(response.status).json(response);
};

const declineFollowRequest = async (req, res) => {
  const response = await notificationService.declineFollowRequests(req);

  return res.status(response.status).json(response);
};

module.exports = { followRequest, acceptFollowRequest, declineFollowRequest };
