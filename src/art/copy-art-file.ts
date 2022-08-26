import { Shortcut } from '../shortcut';
import { join } from 'path';

/**
 * Describes the type of artwork that Steam recognizes.
 */
export type ArtworkType = 'grid' | 'logo' | 'background' | 'icon';

/**
 * Returns the filepath where art for the given shortcut belongs.
 *
 * @param {Shortcut} shortcut - Shortcut for which to retrieve art path.
 * @param {string} artDirPath - Path to Steam grid artwork directory.
 * @param {ArtworkType} artType - The type of artwork for which to retrieve path.
 * @param {string} extension - File extension for artwork. Optional, default is `.png`.
 */
export const getArtworkPathForShortcut = (
  shortcut: Shortcut,
  artDirPath: string,
  artType: ArtworkType,
  extension: string = '.png',
): string => {
  switch (artType) {
    case 'grid':
      return join(artDirPath, `${shortcut.getAppId()}p${extension}`);

    case 'logo':
      return join(artDirPath, `${shortcut.getAppId()}_logo${extension}`);

    case 'icon':
      return join(artDirPath, `${shortcut.getAppId()}_icon${extension}`);

    case 'background':
      return join(artDirPath, `${shortcut.getAppId()}_hero${extension}`);
  }
};
