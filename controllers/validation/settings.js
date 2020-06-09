'use strict';

const { yup, formatYupErrors } = require('strapi-utils');

// helper for yup transform function
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

const settingsSchema = yup.object({
  quality: yup.number().required().min(1).max(100),
  progressive: yup.boolean().required(),
  formats: yup.array().of(yup.object().shape({
    name: yup.string().matches(/^[a-zA-Z0-9_-]+$/gi).required(),
    x2: yup.boolean(),
    width: yup.number().required().min(1),
    height: yup.number().min(1).transform(emptyStringToNull).nullable(),
    fit: yup.string(),
    position: yup.string(),
    withoutEnlargement: yup.boolean(),
  })),
});

const validateSettings = data => {
  return settingsSchema
    .validate(data, {
      abortEarly: false,
    })
    .catch(error => {
      throw strapi.errors.badRequest('ValidationError', {
        errors: formatYupErrors(error),
      });
    });
};

module.exports = validateSettings;