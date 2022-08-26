/**
 * @file Utility to get concrete values from nullable or `undefined` values.
 */

// TODO Add unit tests for `getValueOr<T>()`.
/**
 * Returns the given value if it is not `null` or `undefined`.
 *
 * If the given value is `null` or `undefined`, a default value is returned.
 *
 * @param {T | undefined | null} givenValue - Value to get if not `undefined` or `null`.
 * @param {T} defaultValue - Value to return if given value is `undefined` or `null`.
 *
 * @returns {T} `givenValue`, or `defaultValue` if `givenValue` is `undefined` or `null`.
 */
export const getValueOr = <T>(
  givenValue: T | undefined | null,
  defaultValue: T,
): T => {
  if (givenValue === undefined || givenValue === null) {
    return defaultValue;
  }
  return givenValue;
};
