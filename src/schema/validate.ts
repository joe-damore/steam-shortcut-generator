/**
 * @file Function to validate data against a given schema.
 */

import Ajv, { JSONSchemaType } from 'ajv';
import { ShortcutFileInfo } from '../shortcut/file-info';

/**
 * Validates an object against a schema of a given type.
 *
 * @param {Object} object - Object to validate.
 * @param {JSONSchemaType<T>} schema - Schema against which to validate `object`.
 * @param {ShortcutFileInfo | undefined} fileInfo - Optional file info to include in error messages.
 *
 * @throws {Error} Throws if `data` cannot be validated against type `T`.
 *
 * @returns {T} Validated `object` cast as type `T`.
 */
export const validateSchema = <T>(
  object: Object,
  schema: JSONSchemaType<T>,
  fileInfo?: ShortcutFileInfo,
): T => {
  const ajv = new Ajv();
  const validator = ajv.compile<T>(schema);

  // Validation type guards as `T` on success.
  if (validator(object)) {
    return object;
  }

  // TODO Create and use a validation-specific error type.
  // TODO Use AJV error objects to show message.
  console.log(validator.errors);
  const message = (() => {
    if (!fileInfo) {
      return 'An error occurred while validating shortcut data';
    }
    return `An error occurred while validating shortcut data for '${fileInfo.filename}'`;
  })();
  console.error(message);
  throw new Error(message);
};
