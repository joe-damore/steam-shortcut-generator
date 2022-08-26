import { extname } from 'path';
import { arrayify, findFileSync } from '../util';

// TODO Add async version of `findArtFileSync()`.

/**
 * File extensions that are checked when given an art file path with no extension.
 */
export const allowedArtFileExtensions = [
  '.png',
  '.jpg',
  '.jpeg',
  '.PNG',
  '.JPG',
  '.JPEG',
];

// TODO Add unit tests for `getArtSearchPathsFromFilepath()`.
/**
 * Returns a list of filepaths to search when looking for an artwork file.
 *
 * If the given filepath has an extension, an array containing only that path
 * is returned. If no extension is specified, the array will contain multiple
 * paths for each of the allowed file extensions.
 *
 * @param {string} artFilepath - Filepath from which to create search paths.
 *
 * @return {string[]} Array of filepaths that may contain the desired artwork.
 */
export const getArtSearchPathsFromFilepath = (
  artFilepath: string,
): string[] => {
  if (extname(artFilepath) === '') {
    return allowedArtFileExtensions.map((extension: string) => {
      return `${artFilepath}${extension}`;
    });
  }
  return arrayify(artFilepath);
};

// TODO Add unit tests for `findArtFileSync()`.
/**
 * Returns the path to the given art file if it exists.
 *
 * If `artFilepath` has no file extension, this function will look for a PNG and
 * JPEG file with the given filename.
 *
 * If no art file can be found, `null` is returned.
 *
 * @param {string} artFilepath - Path to desired art file. File extension is optional.
 *
 * @returns {string | null} Path to found art file if it exists, `null` otherwise.
 */
export const findArtFileSync = (artFilepath: string): string | null => {
  const searchFiles = getArtSearchPathsFromFilepath(artFilepath);
  return findFileSync(searchFiles);
};
