const express = require("express");
const categoryController = require("../controllers/category.controller");
const validate = require("../middlewares/validate");
const { categoryValidation } = require("../validations");
const auth = require("../middlewares/auth");

const router = express.Router();

/**
 * Create category
 */
router.post(
  "/createCategory",
  validate(categoryValidation.createCategory),
  categoryController.createCategory
);

/**
 * Get category
 */
router.get(
  "/getCategory",
  validate(categoryValidation.getCategory),
  categoryController.getCategory
);

/**
 * Update category
 */
router.put(
  "/updateCategory",
  validate(categoryValidation.updateCategory),
  categoryController.updateCategory
);

/**
 * Delete category
 */
router.delete(
  "/deleteCategory",
  validate(categoryValidation.deleteCategory),
  categoryController.deleteCategory
);

module.exports = router;
