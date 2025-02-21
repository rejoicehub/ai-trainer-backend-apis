const { generateToken } = require("../utils/utils");
const emailService = require("../services/email-sending");
const bcrypt = require("bcryptjs");
const message = require("../json/message.json");
const emailTemplate = require("../templates/emailTemplate");
const { CategoryModel } = require("../models");
const apiResponse = require("../utils/api.response");
const moment = require("moment");
const logger = require("../config/logger");
const axios = require("axios");
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * POST: Login (User)
 */
module.exports = {
  createCategory: async (req, res) => {
    try {
      const {category_name} = req.body;

      const findOldCategory = await CategoryModel.findOne({ category_name: category_name });
      if(findOldCategory) {
        return apiResponse.DUPLICATE_VALUE({ res, message: "Your category already exist." })
      }

      const createCategory = await CategoryModel.create({ category_name: category_name });
      return apiResponse.OK({
        res,
        message: message.created,
        data: createCategory,
      });
    } catch (err) {
      logger.error("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  getCategory: async (req, res) => {
    try {

      const findCategory = await CategoryModel.find({ isActive: true });
      if (!findCategory) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Category not found!",
        });
      }
      return apiResponse.OK({
        res,
        message: "Get all category",
        data: findCategory,
      });
    } catch (error) {
      console.log(error, "---------- Catch error --------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      let id = req.query.id;
      const findCategory = await CategoryModel.findOne({ _id: id });
      if (!findCategory``) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Category not found!",
        });
      }
      const updateCategory = await CategoryModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
      return apiResponse.OK({
        res,
        message: message.updated,
        data: updateCategory,
      });
    } catch (error) {
      console.log(error, "---------- Catch error ----------");
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      let id = req.query.id;
      const findCategory = await CategoryModel.findOne({ _id: id });
      if (!findCategory) {
        return apiResponse.NOT_FOUND({
          res,
          message: "Category not found!",
        });
      }
      await CategoryModel.findOneAndDelete({ _id: id });
      return apiResponse.OK({ res, message: "Success!" });
    } catch (err) {
      console.log(err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.something_went_wrong,
      });
    }
  },
};
