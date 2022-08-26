import Ajv, { JSONSchemaType } from 'ajv';

/**
 * Validates an object against a schema of a given type.
 *
 * @param {Object} object - Object to validate.
 * @param {JSONSchemaType<T>} schema - Schema against which to validate `object`.
 *
 * @throws {Error} Throws if `data` cannot be validated against type `T`.
 *
 * @returns {T} Validated `object` cast as type `T`.
 */
export const validateSchema = <T>(
  object: Object,
  schema: JSONSchemaType<T>,
): T => {
  const ajv = new Ajv();
  const validator = ajv.compile<T>(schema);

  // Validation type guards as `T` on success.
  if (validator(object)) {
    return object;
  }

  // TODO Create and use a validation-specific error type.
  // TODO Use AJV error objects to show message.
  throw new Error('Error occurred while validating data');
};
