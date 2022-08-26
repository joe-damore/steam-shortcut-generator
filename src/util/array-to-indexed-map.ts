/**
 * @file Util to convert arrays to objects.
 */

// TODO Add unit tests for `arrayToIndexedMap()`.
/**
 * Converts an array into an indexed map object.
 *
 * @example
 * const data = ['a', 'b', 'c'];
 * const map = arrayToIndexedMap(data);
 * // Result:
 * // {
 * //   '0': 'a',
 * //   '1': 'b',
 * //   '2': 'c'
 * // }
 *
 * @param {any[]} arrayValue - Array to convert to a map object.
 *
 * @returns {any} Indexed map from given array.
 */
export const arrayToIndexedMap = (arrayValue: any[]): any => {
  return arrayValue.reduce((acc: any, cur: any, index: number) => {
    acc[`${index}`] = cur;
    return acc;
  }, {});
};
