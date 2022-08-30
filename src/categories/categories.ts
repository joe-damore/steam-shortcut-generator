/**
 * @file Types, functions, and constants related to Steam category management.
 */

/**
 * The prefix used to find collections among other Steam DB entries.
 *
 * @var {string}
 */
export const steamCollectionPrefix = 'user-collections.';

/**
 * Returns a collection ID slug for the given category name.
 *
 * @param {string} name - Category name.
 *
 * @returns {string} Steam collection ID slug for category name.
 */
export const createCollectionId = (name: string): string => {
  const hyphenated = name.replace(/\s/g, '-');
  return `ssg-${hyphenated}`;
};

/**
 * Returns a collection ID for the given category name.
 *
 * @param {string} name - Category name.
 *
 * @returns {string} Steam collection ID for category name.
 */
export const createCollectionKey = (name: string): string => {
  const slug = createCollectionId(name);
  return `user-collections.${slug}`;
};

// TODO Document thrown error in `decodeCategoryData()`.
// TODO Add unit tests for `decodeCategoryData()`.
/**
 * Returns a `SteamCategoryData` object from a LevelDB value string.
 *
 * @param {string} categoryString - LevelDB category string value.
 *
 * @returns {SteamCategoryData} Steam category data from string.
 */
export const decodeCategoryData = (
  categoryString: string,
): SteamCategoryData => {
  const categoryData = JSON.parse(categoryString);
  if (!categoryData['id'] || !categoryData['name']) {
    // TODO Consider defining and using error type when Steam library data is malformed.
    throw new Error(
      'Unable to decode Steam collection data; missing `id` or `name` properties',
    );
  }
  return {
    id: categoryData['id'],
    name: categoryData['name'],
    added: categoryData['added'],
    removed: categoryData['removed'],
    filterSpec: categoryData['filterSpec'],
  };
};

// TODO Add unit tests for `encodeCategoryData()`.
/**
 * Returns a string from a `SteamCategoryData` object.
 *
 * @param {SteamCategoryData} categoryData - Category data to encode as a string.
 *
 * @returns {string} Encoded category data.
 */
export const encodeCategoryData = (categoryData: SteamCategoryData): string => {
  return JSON.stringify(categoryData);
};

/**
 * Data describing a Steam category as it appears and behaves in the Steam UI.
 */
export interface SteamCategoryData {
  /**
   * Steam category unique ID.
   *
   * @var {string}
   */
  id: string;

  /**
   * Steam category name.
   *
   * This appears in Steam's UI as the category label.
   *
   * @var {string}
   */
  name: string;

  // TODO Clarify in documentation whether new or legacy Steam ID is used.
  /**
   * Array of Steam game IDs that have been explicitly added to the collection.
   *
   * An empty array or `undefined` indicate no games have been explicitly added
   * to the collection.
   *
   * @var {number[] | undefined}
   */
  added?: number[];

  // TODO Clarify in documentation whether new or legacy Steam ID is used.
  /**
   * Array of Steam game IDs that have been explicitly removed from the collection.
   *
   * An empty array or `undefined` indicate no games have been explicitly
   * removed from the collection.
   *
   * @var {number[] | undefined}
   */
  removed?: number[];

  // TODO Define and document types for Steam collection filtering.
  /**
   * Object describing automatic filters to apply for collection.
   *
   * @var {any | undefined}
   */
  filterSpec?: any;
}

/**
 * Data describing a Steam category and its representation in the library DB.
 */
export interface SteamCategory {
  /**
   * Namespace key for category.
   *
   * This should only be `undefined` when creating a new category; you should
   * not modify this value for an existing category.
   *
   * @var {string | undefined}
   */
  namespaceKey?: string;

  /**
   * Entry key for Steam category.
   *
   * @var {string}
   */
  entryKey: string;

  /**
   * Whether or not Steam category has been deleted.
   *
   * @var {boolean | undefined}
   */
  isDeleted?: boolean;

  /**
   * Steam category data.
   *
   * @var {SteamCategoryData | undefined}
   */
  data?: SteamCategoryData;

  /**
   * Steam category entry version.
   *
   * This should only be `undefined` when creating a new category; you should
   * not modify this value for an existing category.
   */
  version?: string;

  /**
   * Steam category modification timestamp.
   */
  timestamp?: number;
}
