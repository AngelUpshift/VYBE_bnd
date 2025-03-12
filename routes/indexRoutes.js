const express = require("express");
const router = express.Router();
const authRoute = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
];

defaultRoutes.forEach((value) => router.use(value.path, value.route));

module.exports = router;
