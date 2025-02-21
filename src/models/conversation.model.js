const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const conversationSchema = mongoose.Schema(
  {
    conversation_id: {
      type: String,
      trim: true,
      default: null,
    },
    uid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * @typedef Conversation
 */
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
