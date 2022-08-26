/**
 * @file Shortcut loader class.
 */

import { lstatSync, readdirSync, readFileSync } from 'fs';
import { resolve, extname } from 'path';
import merge from 'ts-deepmerge';
import { yamlSerializer } from '../serializer/yaml-serializer';
import { findFileSync } from '../util';
import { getShortcutFileInfo } from './file-info';
import { ShortcutParser } from './parser';
import { Shortcut } from './shortcut';

/**
 * File extensions for discovered files when searching in a directory.
 */
export const allowedExtensions = ['.yml', '.yaml', '.YML', '.YAML'];

/**
 * Allowed filenames for `__default` files.
 */
export const allowedDefaultFilenames = [
  '__default.yml',
  '__default.yaml',
  '__default.YML',
  '__default.YAML',
];

/**
 * Loads and deserializes the `__default` file for the given directory.
 *
 * If no `__default` file exists, `{}` is returned.
 *
 * @param {string} dirpath - Path to directory containing `__default` file.
 *
 * @returns {Object} Loaded object from `__default`.
 */
const getDefaultDataSync = (dirpath: string): Object => {
  const allowedFiles = allowedDefaultFilenames.map(
    (defaultFilename: string) => {
      return resolve(dirpath, defaultFilename);
    },
  );

  const defaultFile = findFileSync(allowedFiles);
  if (!defaultFile) {
    return {};
  }

  let defaultFileObject = {};
  try {
    const defaultFileData = readFileSync(defaultFile, 'utf8');
    defaultFileObject = yamlSerializer.deserialize(defaultFileData);
  } catch {
    return {};
  }
  return defaultFileObject;
};

// TODO Add unit tests for `ShortcutLoader` class.
/**
 * Loads shortcuts from files and directories.
 */
export class ShortcutLoader {
  /**
   * Loads a shortcut from a file synchronously.
   *
   * @param {string} filepath - Path to shortcut file.
   *
   * @returns {Shortcut} Loaded `Shortcut` instance.
   */
  static loadFromFileSync(filepath: string): Shortcut {
    const fileInfo = getShortcutFileInfo(filepath);
    const defaultObject = getDefaultDataSync(fileInfo.dirpath);
    return ShortcutLoader.loadFromFileWithDefaultsSync(filepath, defaultObject);
  }

  /**
   * Loads a shortcut from a file with a defaults object synchronously.
   *
   * The shortcut data at `filepath` will be merged with `defaultObject`.
   *
   * @param {string} filepath - Path to shortcut file.
   * @param {Object} defaultObject - Defaults object with which to merge shortcut data.
   *
   * @returns {Shortcut} Loaded `Shortcut` instance.
   */
  static loadFromFileWithDefaultsSync(
    filepath: string,
    defaultObject: Object,
  ): Shortcut {
    const fileInfo = getShortcutFileInfo(filepath);
    const shortcutData = readFileSync(filepath, 'utf8');
    const shortcutObject = yamlSerializer.deserialize(shortcutData);
    const resolvedObject = merge(defaultObject, shortcutObject);
    return ShortcutParser.fromObject(resolvedObject, fileInfo);
  }

  /**
   * Loads shortcuts from a directory synchronously.
   *
   * @param {string} dirpath - Path to shortcut directory.
   *
   * @returns {Shortcut[]} Array of loaded `Shortcut` instances.
   */
  static loadFromDirSync(dirpath: string): Shortcut[] {
    const excludedFiles = allowedDefaultFilenames;
    const defaultData = getDefaultDataSync(dirpath);

    return readdirSync(dirpath)
      .reduce((acc: Shortcut[], cur: string) => {
        const dirItem = cur;
        // Short circuit if item is a known excluded file.
        if (excludedFiles.includes(dirItem)) {
          return acc;
        }
        // Short circuit if item does not have an allowed extension.
        if (!allowedExtensions.includes(extname(dirItem))) {
          return acc;
        }

        // Short circuit if item is not a file.
        const stat = lstatSync(resolve(dirpath, dirItem));
        if (!stat.isFile()) {
          return acc;
        }

        const resolvedPath = resolve(dirpath, dirItem);
        const shortcut = ShortcutLoader.loadFromFileWithDefaultsSync(
          resolvedPath,
          defaultData,
        );

        acc.push(shortcut);
        return acc;
      }, []);
  }

  /**
   * Loads shortcuts from a directory recursively and synchronously.
   *
   * @param {string} dirpath - Path to shortcut directory.
   *
   * @returns {Shortcut[]} Array of loaded `Shortcut[]` instances.
   */
  static loadFromDirRecursiveSync(dirpath: string): Shortcut[] {
    const excludedFiles = allowedDefaultFilenames;
    let shortcuts: Shortcut[] = [];

    for (const dirItem of readdirSync(dirpath)) {
      if (excludedFiles.includes(dirItem)) {
        continue;
      }
      const resolvedPath = resolve(dirpath, dirItem);
      const stat = lstatSync(resolvedPath);
      if (stat.isDirectory()) {
        shortcuts = [
          ...shortcuts,
          ...ShortcutLoader.loadFromDirRecursiveSync(resolvedPath),
        ];
      } else {
        if (allowedExtensions.includes(extname(dirItem))) {
          shortcuts.push(ShortcutLoader.loadFromFileSync(resolvedPath));
        }
      }
    }

    return shortcuts;
  }
}
