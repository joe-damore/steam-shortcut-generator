import { copyFileSync, mkdirSync } from 'fs';
import { extname, join, resolve } from 'path';
import { Shortcut } from '../shortcut';
import { findArtFileSync } from './art-finder';

// TODO Add async version of `copyArtworkForShortcutSync()`.

/**
 * Describes the type of artwork that Steam recognizes.
 */
export type ArtworkType = 'grid' | 'logo' | 'background' | 'icon' | 'banner';

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
      return join(artDirPath, `${shortcut.getNewAppId()}p${extension}`);

    case 'logo':
      return join(artDirPath, `${shortcut.getNewAppId()}_logo${extension}`);

    case 'icon':
      return join(artDirPath, `${shortcut.getNewAppId()}_icon${extension}`);

    case 'background':
      return join(artDirPath, `${shortcut.getNewAppId()}_hero${extension}`);

    case 'banner':
      return join(artDirPath, `${shortcut.getAppId()}${extension}`);
  }
};

/**
 * Copies applicable artwork files to the artwork directory path for a shortcut.
 *
 * @param {Shortcut} shortcut - Shortcut for which to copy art.
 * @param {string} artDirPath - Path to directory where artwork should be copied.
 */
export const copyArtworkForShortcutSync = (
  shortcut: Shortcut,
  artDirPath: string,
) => {
  // TODO Clean up types in `copyArtworkForShortcutSync()`.
  const artworkCopyTasks: { art: string | undefined; type: ArtworkType }[] = [
    { art: shortcut.artIcon, type: 'icon' },
    { art: shortcut.artLogo, type: 'logo' },
    { art: shortcut.artGrid, type: 'grid' },
    { art: shortcut.artBackground, type: 'background' },
    { art: shortcut.artBanner, type: 'banner' },
  ];

  artworkCopyTasks.forEach((artworkCopyTask) => {
    if (artworkCopyTask.art) {
      const iconSrcPath = findArtFileSync(artworkCopyTask.art);
      if (iconSrcPath) {
        try {
          const extension = extname(iconSrcPath);
          const iconDestDir = resolve(artDirPath);
          const iconDestPath = getArtworkPathForShortcut(
            shortcut,
            iconDestDir,
            artworkCopyTask.type,
            extension,
          );

          mkdirSync(iconDestDir, { recursive: true });
          copyFileSync(iconSrcPath, iconDestPath);
        } catch (e: unknown) {
          // TODO Handle error more gracefully if mkdir/copy operation fails.
        }
      }
    }
  });
};
