const responseService = require("../utils/responseService");

const userResponseObject = (user) => {
  const userData = {
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    bio: user.bio,
    profilePicture: user.profilePicture,
    gender: user.gender,
  };

  return userData;
};

module.exports = userResponseObject;
