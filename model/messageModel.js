const mongoose = require("mongoose");
const { messageTypes, reactionTypes } = require("../config/roles");
const mongooseAutoPopulate = require("mongoose-autopopulate");

const MessageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    content: {
      type: String,
      trim: true,
    },
    messageType: {
      type: String,
      enum: messageTypes,
      default: messageTypes.TEXT,
    },
    reaction: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

        type: {
          type: String,
          enum: reactionTypes,
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
