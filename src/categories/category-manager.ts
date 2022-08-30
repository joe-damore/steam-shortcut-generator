/**
 * @file Class to read and write Steam library DB categories.
 */

import { SteamLocalDb, SteamLocalDbEntry } from '../local-db';
import { createTimestamp } from '../util/timestamp';
import {
  decodeCategoryData,
  encodeCategoryData,
  SteamCategory,
  steamCollectionPrefix,
} from './categories';

// TODO Add `CategoryManager.close()` or similar method.
/**
 * Reads and writes categories to the Steam library DB.
 */
export class CategoryManager {
  /**
   * Level DB instance containing Steam library categories.
   *
   * @var {Level}
   */
  private steamDb;

  /**
   * Constructor.
   *
   * @param {string} dbPath - Path to Level database containing Steam category info.
   * @param {number} steamId - Steam user ID for library being opened.
   */
  constructor(dbPath: string, steamId: number) {
    //this.prefix = `_https://steamloopback.host\u0000\u0001U${steamId}-cloud-storage-namespace`;
    //this.db = new Level(dbPath, { valueEncoding: 'hex' });
    this.steamDb = new SteamLocalDb(dbPath, steamId);
  }

  // TODO Add unit tests for `CategoryManager.getCategories()`.
  /**
   * Gets an array of Steam categories from the library DB.
   *
   * @returns {Promise<SteamCategory[]>} Promise that resolves to an array of `SteamCategory` instances.
   */
  async getCategories(): Promise<SteamCategory[]> {
    const allEntries = await this.steamDb.getEntries();
    return (
      allEntries
        // Filter out non-collection DB entries.
        .filter((entry: SteamLocalDbEntry) => {
          return entry.key.startsWith(steamCollectionPrefix);
        })
        // Map entries to `SteamCategory` instances.
        .map((entry: SteamLocalDbEntry): SteamCategory => {
          const categoryData = (() => {
            if (entry.value) {
              return decodeCategoryData(entry.value);
            }
            return undefined;
          })();

          return {
            namespaceKey: entry.namespaceKey,
            entryKey: entry.key,
            isDeleted: entry.isDeleted,
            version: entry.version,
            data: categoryData,
          };
        })
    );
  }

  // TODO Add unit tests for `CategoryManager.setCategories()`.
  /**
   * Sets Steam library DB categories from an array of `SteamCategory` instances.
   *
   * @param {SteamCategory[]} categories - Array of `SteamCategory` instances to use for categories.
   *
   * @returns {Promise<SteamCategory[]>} Promise that resolves when categories have been updated.
   */
  async setCategories(categories: SteamCategory[]): Promise<void> {
    const availableNamespace = await this.steamDb.getLastNamespaceKey();
    const entries = categories.map(
      (category: SteamCategory): SteamLocalDbEntry => {
        return {
          namespaceKey: category.namespaceKey || availableNamespace,
          key: category.entryKey,
          version: category.version,
          value: category.data ? encodeCategoryData(category.data) : undefined,
          timestamp: category.timestamp || createTimestamp(),
          isDeleted: category.isDeleted,
        };
      },
    );

    this.steamDb.updateEntries(entries);
  }
}
