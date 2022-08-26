/**
 * @file Utilities to assist with file path handling.
 */

import { isAbsolute, resolve } from 'path';

// TODO Add unit tests for `resolveRelativePath()`.
/**
 * Resolves a relative filepath against an optional base path.
 *
 * If the given path is absolute, it is returned.
 *
 * @param {string} filepath - Filepath to resolve.
 * @param {string=} baseDir - Optional path to directory to use as base for relative path.
 *
 * @returns {string} Resolved path for `filepath`.
 */
export const resolveRelativePath = (
  filepath: string,
  baseDir?: string,
): string => {
  if (isAbsolute(filepath)) {
    return filepath;
  }
  if (baseDir) {
    return resolve(baseDir, filepath);
  }
  return resolve(filepath);
};
