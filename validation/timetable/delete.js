const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.empty": "ID is required.",
      "string.guid": "ID must be a valid UUID.",
    }),
});

module.exports = schema;
