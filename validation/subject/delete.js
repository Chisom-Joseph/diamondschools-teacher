const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().min(1).max(36).required().messages({
    "string.empty": "Input a subject name to continue.",
    "string.min": "Religion must be at least 1 characters long.",
    "string.max": "Religion cannot exceed 30 characters.",
  }),
});

module.exports = schema;
