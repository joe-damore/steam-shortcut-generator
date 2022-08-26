/**
 * @file Utilities to convert booleans to numbers and vice-versa.
 */

/**
 * Converts a `boolean` value to a `number` value.
 *
 * If the given value is truthy, `1` is returned. Otherwise, `0` is returned.
 *
 * @param {boolean} boolValue - Boolean value.
 *
 * @returns {number} `1` if `boolValue` is truthy, `0` otherwise.
 */
export const booleanToNumber = (boolValue: boolean): number => {
  if (boolValue) {
    return 1;
  }
  return 0;
};

/**
 * Converts a `number` value to a `boolean` value.
 *
 * If the given value is larger than `0`, `true` is returned. Otherwise, `false`
 * is returned.
 *
 * @param {number} numberValue - Number value.
 *
 * @returns {boolean} `true` if `numberValue` is larger than `0`, `false` otherwise.
 */
export const numberToBoolean = (numberValue: number): boolean => {
  if (numberValue > 0) {
    return true;
  }
  return false;
};
