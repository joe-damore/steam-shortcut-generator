import { getShortcutHash, getShortcutUrl } from 'steam-binary-vdf';

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
   * @var {string[] | undefined}
   */
  execArgs: string[] | undefined;

  /**
   * Shortcut extra command line arguments.
   *
   * These arguments are applied after `execArgs`.
   *
   * @var {string[] | undefined}
   */
  execExtraArgs?: string[] | undefined;

  /**
   * Path to shortcut icon art.
   *
   * @var {string[] | undefined}
   */
  artIcon: string | undefined;

  /**
   * Path to shortcut logo art.
   *
   * @var {string[] | undefined}
   */
  artLogo: string | undefined;

  /**
   * Path to shortcut grid art.
   *
   * @var {string[] | undefined}
   */
  artGrid: string | undefined;

  /**
   * Path to shortcut background art.
   *
   * @var {string[] | undefined}
   */
  artBackground: string | undefined;

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
  }

  /**
   * Returns the app ID for this shortcut.
   *
   * This ID is used to generate the shortcut launch URL and artwork filenames.
   *
   * @returns {string} Steam shortcut app ID.
   */
  getAppId(): string {
    return getShortcutHash(`${this.execBin}${this.name}`);
  }

  /**
   * Returns the shortcut launch URL for this shortcut.
   *
   * @returns {string} Steam shortcut launch URL.
   */
  getLaunchUrl(): string {
    return getShortcutUrl(this.name, this.execBin);
  }
}
