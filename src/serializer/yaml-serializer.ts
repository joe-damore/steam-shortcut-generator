/**
 * @file YAML serializer.
 */

import type { Serializer } from './serializer';
import YAML from 'yaml';

/**
 * YAML serializer object.
 */
export const yamlSerializer: Serializer = {
  // TODO Create a serialization error type and throw it if YAML errors occur.
  /**
   * Serializes an Object as a YAML string.
   *
   * @param {Object} data - Object to serialize.
   *
   * @returns {string} YAML-serialized object.
   */
  serialize: (data: Object): string => {
    return YAML.stringify(data);
  },

  // TODO Create a serialization error type and throw it if YAML errors occur.
  /**
   * Deserializes a YAML string and returns the resulting object.
   *
   * @param {string} data - YAML string to parse.
   *
   * @returns {Object} Deserialized object.
   */
  deserialize: (data: string): Object => {
    return YAML.parse(data);
  },
};
