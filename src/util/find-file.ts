/**
 * @file Utilities to find files from a list of possible filepaths.
 */

import { existsSync } from 'fs';

/**
 * Returns the first of the given file paths that exists.
 *
 * If none of the given filepaths exist, `null` is returned.
 *
 * @param {string[]} filepaths - Array of filepaths to use to find file.
 *
 * @returns { string | null } First given filepath that exists, or `null`.
 */
export const findFileSync = (filepaths: string[]): string | null => {
  for (let filepath of filepaths) {
    if (existsSync(filepath)) {
      return filepath;
    }
  }
  return null;
};
