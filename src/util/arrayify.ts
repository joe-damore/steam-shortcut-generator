/**
 * Returns an array containing the given value if it is not an array.
 *
 * If the given value is an array, it is returned.
 *
 * @param {T|T[]} arrayifyValue - Value to arrayify.
 *
 * @returns {T[]} Arrayified value.
 */
export const arrayify = <T>(arrayifyValue: T | T[]): T[] => {
  return Array.isArray(arrayifyValue) ? arrayifyValue : [arrayifyValue];
};
