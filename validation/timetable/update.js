const Joi = require("joi");

const schema = Joi.object({
  id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required()
    .messages({
      "string.empty": "ID is required.",
      "string.guid": "ID must be a valid UUID.",
    }),

  day: Joi.string()
    .valid(
      "All",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    )
    .required()
    .messages({
      "string.empty": "Day is required.",
      "any.only": "Day must be a valid weekday.",
    }),

  timeFrom: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "Time from is required.",
      "string.pattern.base": "Time from must be in HH:mm format (24-hour).",
    }),

  timeTo: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      "string.empty": "Time to is required.",
      "string.pattern.base": "Time to must be in HH:mm format (24-hour).",
    }),

  subject: Joi.alternatives()
    .try(
      Joi.string().guid({ version: ["uuidv4"] }),
      Joi.string().min(3).max(100) // Arbitrary length limits for the string
    )
    .required()
    .messages({
      "alternatives.match": "Subject must be either a valid UUID or a string.",
      "string.empty": "Subject is required.",
    }),
});

module.exports = schema;
