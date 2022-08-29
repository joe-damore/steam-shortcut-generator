/**
 * @file Class to store shortcut data and facilitate ID retrieval.
 */

import { crc32 } from 'crc';

/**
 * Stores loaded and parsed Steam shortcut data.
 */
export class Shortcut {
  /**
   * Shortcut name.
   *
   * This is the label that appears in Steam's UI.
   *
   * @var {string}
   */
  name: string;

  /**
   * Whether or not shortcut is hidden in Steam library.
   *
   * @var {boolean}
   */
  hidden: boolean;

  /**
   * Whether or not Steam Overlay is enabled.
   *
   * @var {boolean}
   */
  overlay: boolean;

  /**
   * Whether or not shortcut is available from SteamVR.
   *
   * @var {boolean}
   */
  vr: boolean;

  /**
   * Shortcut execution binary.
   *
   * This is a path to the executable that Steam launches for this shortcut.
   *
   * @var {string}
   */
  execBin: string;

  /**
   * Shortcut exection directory.
   *
   * This is a path to the directory where this shortcut is executed.
   *
   * @var {string}
   */
  execCwd: string;

  /**
   * Shortcut command line arguments.
   *
   * @var {string[]}
   */
  execArgs: string[];

  /**
   * Path to shortcut icon art.
   *
   * @var {string | undefined}
   */
  artIcon: string | undefined;

  /**
   * Path to shortcut logo art.
   *
   * @var {string | undefined}
   */
  artLogo: string | undefined;

  /**
   * Path to shortcut grid art.
   *
   * @var {string | undefined}
   */
  artGrid: string | undefined;

  /**
   * Path to shortcut background art.
   *
   * @var {string | undefined}
   */
  artHero: string | undefined;

  /**
   * Path to shortcut banner art.
   *
   * @var {string | undefined }
   */
  artBanner: string | undefined;

  /**
   * Categories to apply to Shortcut.
   *
   * @var {string[]}
   */
  categories: string[];

  /**
   * Constructor.
   *
   * @param {string} name - Shortcut name.
   * @param {string} execBin - Shortcut execution binary.
   * @param {string} execCwd - Shortcut execution directory.
   */
  constructor(name: string, execBin: string, execCwd: string) {
    this.name = name;
    this.execBin = execBin;
    this.execCwd = execCwd;
    this.execArgs = [];
    this.hidden = false;
    this.overlay = true;
    this.vr = false;
    this.categories = [];
  }

  /**
   * Returns the app ID for this shortcut.
   *
   * This ID is used to generate the shortcut launch URL and artwork filenames
   * for Big Picture banners.
   *
   * @returns {string} Steam shortcut app ID.
   */
  getAppId(): string {
    //return getShortcutHash(`${this.execBin}${this.name}`);
    const key = this.execBin + this.name;
    const top = BigInt(crc32(key)) | BigInt(0x80000000);
    return String((BigInt(top) << BigInt(32)) | BigInt(0x02000000));
  }

  /**
   * Returns the new app ID for this shortcut.
   *
   * The new app ID is used by the Steam desktop library and Steam OS 3 artwork
   * filenames.
   *
   * @returns {string} Steam shortcut new app ID.
   */
  getNewAppId(): string {
    const exe = this.execBin;
    const name = this.name;
    const key = exe + name;
    const top = BigInt(crc32(key)) | BigInt(0x80000000);
    const shift =
      ((BigInt(top) << BigInt(32)) | BigInt(0x02000000)) >> BigInt(32);

    return String(shift);
  }

  /**
   * Returns the shortcut launch URL for this shortcut.
   *
   * @returns {string} Steam shortcut launch URL.
   */
  getLaunchUrl(): string {
    return `steam://rungameid/${this.getAppId()}`;
  }
}
