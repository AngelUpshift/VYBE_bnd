const mongoose = require("mongoose");
const mongooseAutoPopulate = require("mongoose-autopopulate");

const PostSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    media: [
      {
        type: String,
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

// PostSchema.index({ user: 1 });
// PostSchema.index({ likes: 1 });
// PostSchema.index({ comments: 1 });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
