const express = require("express");
const { validateToken } = require("../config/token");
const router = express.Router();
const authController = require("../controller/authController");

router.get("/me", validateToken, authController.me);
router.post("/logout", validateToken, authController.logout);
router.post("/change-password", validateToken, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
