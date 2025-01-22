const Joi = require("joi");

const schema = Joi.object({
  subject: Joi.string().min(3).required().messages({
    "string.empty": "First Name is required.",
    "string.min": "First Name must be at least 3 characters long.",
  }),
  day: Joi.alternatives()
    .try(
      Joi.string().min(3).max(10).messages({
        "string.empty": "Day is required.",
        "string.min": "Day must be at least 3 characters long.",
        "string.max": "Day cannot exceed 10 characters.",
      }),
      Joi.array().items(Joi.string().min(3).max(10)).messages({
        "array.includes": "Each day must be a valid string.",
        "array.min": "Day array must have at least one entry.",
      })
    )
    .required()
    .messages({
      "alternatives.match":
        "Day must be either a string or an array of valid strings.",
    }),
  timeFrom: Joi.string().required().messages({
    "string.empty": "Time (from) is required.",
  }),
  timeTo: Joi.string().required().messages({
    "string.empty": "Time (to) is required.",
  }),
});

module.exports = schema;
