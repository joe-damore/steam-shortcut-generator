/**
 * @file Types and functions to get shortcut file information.
 */

import { basename, dirname, extname, resolve } from 'path';

/**
 * Contains useful information about a shortcut file.
 *
 * This is often used when resolving paths
 */
export interface ShortcutFileInfo {
  /**
   * Absolute path to the directory containing the shortcut file.
   */
  dirpath: string;

  /**
   * Absolute path to the shortcut file.
   */
  filepath: string;

  /**
   * Shortcut filename.
   */
  filename: string;

  /**
   * Shortcut filename without its file extension.
   */
  basename: string;
}

/**
 * Returns shortcut file info from a path to a shortcut file.
 *
 * @param {string} filepath - Path to shortcut file.
 *
 * @returns {ShortcutFileInfo} File info for shortcut at `filepath`.
 */
// TODO Add unit tests for `getShortcutFileInfo`.
export const getShortcutFileInfo = (filepath: string): ShortcutFileInfo => {
  const resolvedPath = resolve(filepath);
  const ext = extname(resolvedPath);
  const filename = basename(resolvedPath);
  const filenameNoExt = filename.slice(0, filename.length - ext.length);

  return {
    filepath: resolvedPath,
    filename,
    basename: filenameNoExt,
    dirpath: dirname(resolvedPath),
  };
};
