const Joi = require("joi");

/**
 * Create conversation.
 */
const createConversation = {
  body: Joi.object().keys({
    conversation_id: Joi.string(),
    uid: Joi.string(),
    metadata: Joi.string(),
  }),
};

/**
 * Create conversatopn report
 */
const createReport = {
  query: Joi.object({
    conversation_id: Joi.string()
  })
}

/**
 * Get conversation.
 */
const getConversation = {
  query: Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(100),
    sortBy: Joi.string().default("createdAt"),
    sortOrder: Joi.number().default(-1),
    conversation_id: Joi.string(),
    uid: Joi.string(),
    search: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
  }),
};

/**
 * Update conversation
 */
const updateConversation = {
  query: Joi.object({
    conversation_id: Joi.string(),
    uid: Joi.string(),
  }),
  body: Joi.object().keys({
    conversation_id: Joi.string(),
    uid: Joi.string(),
    metadata: Joi.string(),
  }),
};

/**
 * Delete conversation.
 */
const deleteConversation = {
  query: Joi.object().keys({
    id: Joi.string(),
  }),
};

/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  createConversation,
  createReport,
  getConversation,
  updateConversation,
  deleteConversation,
};
