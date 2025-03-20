const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { genderTypes, roleTypes } = require("../config/roles");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mongooseAutoPopulate = require("mongoose-autopopulate");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "Username is taken"],
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email is taken!"],
      trim: true,
      validate: [isEmail, "Email is not valid!"],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: genderTypes,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    followRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Post",
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Post",
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Post",
      },
    ],
    role: {
      type: String,
      enum: roleTypes,
      default: roleTypes.USER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    blockedProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    chatPreferences: {
      notifications: { type: Boolean, default: true },
      theme: { type: String, default: "light" },
    },
    // googleId: {
    //
    // },
    // facebookId: {
    //
    // }.
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpireAt: Date,
  },
  {
    timestamps: true,
  }
);

// UserSchema.index({ username: 1 });
// UserSchema.index({ email: 1 });
// UserSchema.index({ followers: 1 });
// UserSchema.index({ following: 1 });
// UserSchema.index({ followRequests: 1 });

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  }
});

UserSchema.methods.createRandomResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpireAt = Date.now() + 900000;

  return resetToken;
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
