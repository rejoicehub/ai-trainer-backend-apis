const Joi = require("joi");

/**
 * Create category.
 */
const createCategory = {
  body: Joi.object().keys({
    category_name: Joi.string(),
  }),
};


/**
 * Get category.
 */
const getCategory = {
  query: Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(100),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
    search: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

/**
 * Update category
 */
const updateCategory = {
  query: Joi.object({
    id: Joi.string(),
  }),
  body: Joi.object().keys({
    category_name: Joi.string(),
  }),
};

/**
 * Delete category.
 */
const deleteCategory = {
  query: Joi.object().keys({
    id: Joi.string(),
  }),
};

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
