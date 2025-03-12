const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { genderTypes, roleTypes } = require("../config/roles");
const bcrypt = require("bcryptjs");

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
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    posts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        // ref: postModel,
      },
    ],
    likedPosts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        // ref: postModel,
      },
    ],
    savedPosts: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        // ref: postModel,
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
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
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

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  }
});

// kreiranje reset token tuka =>

const User = mongoose.model("Users", UserSchema);
module.exports = User;
