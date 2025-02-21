const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const categorySchema = mongoose.Schema(
  {
    category_name: {
      type: String,
      trim: true,
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
 * @typedef Category
 */
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
