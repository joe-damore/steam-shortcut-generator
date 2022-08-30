/**
 * @file Utility to generate a timestamp for Steam library database.
 */

// TODO Add unit tests for `createTimestamp()`.
/**
 * Returns a timestamp for the current time which can be used by Steam.
 *
 * @returns {number} Timestamp for the current time.
 */
export const createTimestamp = (): number => {
  return Math.ceil(Date.now() / 1000);
};
