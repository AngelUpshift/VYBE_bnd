const express = require("express");
const { validateToken } = require("../config/token");
const router = express.Router();
const notificationController = require("../controller/notificationController");

router.post("/follow/:id", validateToken, notificationController.followRequest);
router.post(
  "/accept-follow-request/:id",
  validateToken,
  notificationController.acceptFollowRequest
);
router.post(
  "/decline-follow-request/:id",
  validateToken,
  notificationController.declineFollowRequest
);

module.exports = router;
