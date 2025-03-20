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

const notificationResponseObject = (notification) => {
  const notify = {
    user: notification.user.username,
    type: notification.type,
    sender: notification.sender.username,
    content: notification.content,
    link: notification.link,
  };

  return notify;
};

module.exports = { userResponseObject, notificationResponseObject };
