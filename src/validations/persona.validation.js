const Joi = require("joi");

/**
 * Login.
 */
const createPersona = {
  body: Joi.object().keys({
    persona_name: Joi.string(),
    email: Joi.string().trim().email(),
    system_prompt: Joi.string(),
    context: Joi.string(),
    default_replica_id: Joi.string(),
    apiKey: Joi.string(),
    trainerTitle: Joi.string(),
    trainerDescription: Joi.string(),
    category_id: Joi.string()
  }),
};


/**
 * All auth validations are exported from here 👇
 */
module.exports = {
  createPersona,
};
