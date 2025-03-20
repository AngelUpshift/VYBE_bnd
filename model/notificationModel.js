const mongoose = require("mongoose");
const { notificationTypes } = require("../config/roles");
const mongooseAutoPopulate = require("mongoose-autopopulate");

const NotificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: notificationTypes,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
  },
});

// NotificationSchema.index({ user: 1 });
// NotificationSchema.index({ sender: 1 });
// NotificationSchema.index({ type: 1 });

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
