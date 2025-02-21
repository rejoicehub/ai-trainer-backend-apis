const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const personaSchema = mongoose.Schema(
  {
    persona_name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    category_id: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    system_prompt: {
      type: String,
      trim: true,
      default: null,
    },
    context: {
      type: String,
      trim: true,
      default: null,
    },
    persona_id: {
      type: String,
      trim: true,
      default: null,
    },
    default_replica_id: {
      type: String,
      trim: true,
      default: null,
    },
    apiKey: {
      type: String,
      trim: true,
      default: null,
    },
    trainerTitle: {
      type: String,
      trim: true,
      default: null,
    },
    trainerDescription: {
      type: String,
      trim: true,
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
 * @typedef Persona
 */
const Persona = mongoose.model("Persona", personaSchema);

module.exports = Persona;
