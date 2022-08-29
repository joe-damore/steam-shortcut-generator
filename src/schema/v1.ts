/**
 * @file Schema and utilities for v1 shortcut files.
 */

import { JSONSchemaType } from 'ajv';
import { Shortcut, ShortcutFileInfo } from '../shortcut';
import { getValueOr, resolveRelativePath } from '../util';

/**
 * V1 Steam shortcut files.
 */
export interface ShortcutFileV1 {
  /**
   * Shortcut schema version.
   *
   * If undefined, schema version 1 is assumed.
   *
   * @var {number | undefined}
   */
  schema?: number;

  /**
   * Shortcut info.
   *
   * @var { Object }
   */
  info: {
    /**
     * Shortcut name.
     *
     * This is the name that appears in Steam's UI.
     *
     * @var {string}
     */
    name: string;

    /**
     * Whether or not shortcut is hidden.
     *
     * @var {boolean | undefined}
     */
    hidden?: boolean;

    /**
     * Whether or not Steam Overlay is enabled.
     *
     * @var {boolean | undefined}
     */
    overlay?: boolean;

    /**
     * Whether or not shortcut is available from SteamVR.
     *
     * @var {boolean | undefined}
     */
    vr?: boolean;

    /**
     * Array of categories to assign to shortcut.
     *
     * @var {string[] | undefined}
     */
    categories?: string[];

    /**
     * Array of extra categories to assign to shortcut.
     *
     * These categories get applied after `categories`.
     *
     * This allows shortcuts to specify categories without overwriting those
     * specified by a `__default` file.
     */
    extra_categories?: string[];
  };

  /**
   * Shortcut execution info.
   *
   * @var {Object}
   */
  exec: {
    /**
     * Directory from which shortcut should be executed.
     *
     * @var {string}
     */
    cwd: string;

    /**
     * Path to binary to execute for Steam shortcut.
     *
     * @var {string}
     */
    bin: string;

    /**
     * Command line arguments to apply to shortcut.
     *
     * @var {string[] | undefined}
     */
    args?: string[];

    /**
     * Extra command line arguments to apply to shortcut.
     *
     * These arguments get applied after `args` arguments.
     *
     * This allows shortcuts to specify args without overwriting those specified
     * by a `__default` file.
     *
     * @var {string[] | undefined}
     */
    extra_args?: string[];
  };

  /**
   * Shortcut art info.
   *
   * @var {Object}
   */
  art?: {
    /**
     * Path to shortcut icon image.
     *
     * Paths are relative to the shortcut file. File extensions are optional;
     * if omitted, Steam Shortcut Generator will search for a PNG, then JPG.
     *
     *
     * @var {string | undefined}
     */
    icon?: string;

    /**
     * Path to shortcut logo image.
     *
     * Paths are relative to the shortcut file.
     *
     * @var {string | undefined}
     */
    logo?: string;

    /**
     * Path to shortcut grid image.
     *
     * Paths are relative to the shortcut file.
     *
     * @var {string | undefined}
     */
    grid?: string;

    /**
     * Path to shortcut banner image.
     *
     * Banner images are used in Big Picture mode.
     *
     * Paths are relative to the shortcut file.
     *
     * @var {string | undefined}
     */
    banner?: string;

    /**
     * Path to shortcut background image.
     *
     * Paths are relative to the shortcut file.
     */
    hero?: string;
  };
}

/**
 * JSON Schema for Steam Shortcut Generator v1 files.
 */
export const ShortcutFileSchemaV1: JSONSchemaType<ShortcutFileV1> = {
  type: 'object',
  properties: {
    schema: { type: 'number', nullable: true },
    info: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        hidden: { type: 'boolean', nullable: true },
        overlay: { type: 'boolean', nullable: true },
        vr: { type: 'boolean', nullable: true },
        categories: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
        extra_categories: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
    exec: {
      type: 'object',
      properties: {
        cwd: { type: 'string' },
        bin: { type: 'string' },
        args: { type: 'array', items: { type: 'string' }, nullable: true },
        extra_args: {
          type: 'array',
          items: { type: 'string' },
          nullable: true,
        },
      },
      required: ['cwd', 'bin'],
      additionalProperties: false,
    },
    art: {
      type: 'object',
      nullable: true,
      properties: {
        icon: { type: 'string', nullable: true },
        logo: { type: 'string', nullable: true },
        grid: { type: 'string', nullable: true },
        banner: { type: 'string', nullable: true },
        hero: { type: 'string', nullable: true },
      },
    },
  },
  required: ['info', 'exec'],
};

/**
 * Creates a `Shortcut` instance using data from a v1-schema shortcut file.
 *
 * @returns {Shortcut} Shortcut instance.
 */
export const getShortcutFromV1 = (
  shortcutFileData: ShortcutFileV1,
  shortcutFileInfo: ShortcutFileInfo,
): Shortcut => {
  const name = shortcutFileData.info.name;
  const execBin = shortcutFileData.exec.bin;
  const execCwd = shortcutFileData.exec.cwd;
  const shortcut = new Shortcut(name, execBin, execCwd);

  const baseDir = shortcutFileInfo.dirpath;
  const baseName = shortcutFileInfo.basename;

  shortcut.hidden = getValueOr(shortcutFileData.info.hidden, false);
  shortcut.overlay = getValueOr(shortcutFileData.info.overlay, true);
  shortcut.vr = getValueOr(shortcutFileData.info.vr, false);

  shortcut.artIcon = shortcutFileData?.art?.icon
    ? resolveRelativePath(shortcutFileData.art.icon, baseDir)
    : resolveRelativePath(`${baseName}_icon`, baseDir);

  shortcut.artLogo = shortcutFileData?.art?.logo
    ? resolveRelativePath(shortcutFileData.art.logo, baseDir)
    : resolveRelativePath(`${baseName}_logo`, baseDir);

  shortcut.artGrid = shortcutFileData?.art?.grid
    ? resolveRelativePath(shortcutFileData.art.grid, baseDir)
    : resolveRelativePath(`${baseName}_grid`, baseDir);

  shortcut.artBanner = shortcutFileData?.art?.banner
    ? resolveRelativePath(shortcutFileData.art.banner, baseDir)
    : resolveRelativePath(`${baseName}_banner`, baseDir);

  shortcut.artHero = shortcutFileData?.art?.hero
    ? resolveRelativePath(shortcutFileData.art.hero, baseDir)
    : resolveRelativePath(`${baseName}_hero`, baseDir);

  const args = [
    ...getValueOr(shortcutFileData.exec.args, []),
    ...getValueOr(shortcutFileData.exec.extra_args, []),
  ];

  shortcut.execArgs = args;

  const categories = [
    ...getValueOr(shortcutFileData.info.categories, []),
    ...getValueOr(shortcutFileData.info.extra_categories, []),
  ];

  shortcut.categories = categories;

  return shortcut;
};
