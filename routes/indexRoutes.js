const express = require("express");
const router = express.Router();
const authRoute = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const notificationRoute = require("../routes/notificationRoute");
const postRoute = require("../routes/postRoute");
const commentRoute = require("../routes/commentRoute");

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/notification",
    route: notificationRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
  {
    path: "/comment",
    route: commentRoute,
  },
];

defaultRoutes.forEach((value) => router.use(value.path, value.route));

module.exports = router;
