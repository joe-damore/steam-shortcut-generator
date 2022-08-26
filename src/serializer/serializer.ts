/**
 * @file Serializer interface.
 */

/**
 * An object that can serialize data to a given format and back.
 */
export interface Serializer {
  /**
   * Serializes an Object and returns the resulting string.
   *
   * @param {Object} data - Object to serialize.
   *
   * @returns {string} Serialized object.
   */
  serialize: (data: Object) => string;

  /**
   * Deserializes a string and returns the resulting object.
   *
   * @param {string} data - String data to parse.
   *
   * @returns {Object} Deserialized object.
   */
  deserialize: (data: string) => Object;
}
