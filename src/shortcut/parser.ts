/**
 * @file Class to parse loaded Shortcut data.
 */

import {
  getShortcutFromV1,
  ShortcutFileSchemaV1,
  ShortcutFileV1,
} from '../schema/v1';
import { validateSchema } from '../schema/validate';
import { ShortcutFileInfo } from './file-info';
import { Shortcut } from './shortcut';

/**
 * The max schema version supported by this version of Steam Shortcut Generator.
 */
export const maxSchemaVersion = 1;

// TODO Add unit tests for `ShortcutParser` tests.
/**
 * Parses loaded Shortcut data.
 */
export class ShortcutParser {
  /**
   * Returns a `Shortcut` instance from arbitrary data.
   *
   * If the given `shortcutObject` is not a valid shortcut object, an error
   * is thrown.
   *
   * @throws {Error} Error if object fails to validate against the given schema.
   * @throws {Error} Error if the given schema is unknown.
   *
   * @returns {Shortcut}
   */
  public static fromObject(
    shortcutObject: any,
    fileInfo: ShortcutFileInfo,
  ): Shortcut {
    const schema = shortcutObject.schema;
    switch (schema) {
      case 1:
      case undefined:
        validateSchema<ShortcutFileV1>(shortcutObject, ShortcutFileSchemaV1, fileInfo);
        return getShortcutFromV1(shortcutObject, fileInfo);

      default:
        // TODO Define and use error type for unknown schema version.
        // TODO Suggest latest version schema when an unknown schema is specified.
        let message = `Unknown schema version '${schema}'.`;
        throw new Error(message);
    }
  }
}
