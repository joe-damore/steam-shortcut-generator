/**
 * @file Utilities and classes to read and write to Steam local storage LevelDB.
 */

import { Level } from 'level';
import { createTimestamp } from '../util/timestamp';
import iconv from 'iconv-lite';

// TODO Add unit tests for `decodeDbValue()`.
/**
 * Decodes a Steam LevelDB stringified value.
 *
 * @param {string} dbString - Database string to decode.
 *
 * @returns {any} Decoded database value.
 */
const decodeDbValue = (dbString: string): any => {
  // TODO Consider defining and using error type if Steam LevelDB is malformed.
  return JSON.parse(dbString.slice(1));
};

// TODO Add unit tests for `encodeDbValue()`.
/**
 * Encodes an arbitrary value for Steam LevelDB.
 *
 * @param {any} entry - Database value to encode.
 *
 * @returns {string} Encoded database value.
 */
const encodeDbValue = (entry: any): string => {
  // TODO Consider defining and using error if entries are malformed.
  const stringData = JSON.stringify(entry);
  return `00${iconv.encode(stringData, 'utf16le').toString('hex')}`;
};

/**
 * Describes a raw Steam LevelDB value.
 */
interface rawDbEntry {

  /**
   * Determines whether or not the database entry is "deleted".
   *
   * Deleted items do not appear in the UI. `undefined` is equivalent to
   * `false.`
   *
   * @var {boolean | undefined}
   */
  is_deleted?: boolean;

  /**
   * Database entry key.
   *
   * @var {string}
   */
  key: string;

  /**
   * Database modification timestamp.
   *
   * @var {number}
   */
  timestamp: number;

  /**
   * Database entry value.
   *
   * @var {any | undefined}
   */
  value?: any;

  /**
   * Database entry version.
   *
   * @var {string | undefined}
   */
  version?: string;
}

// TODO Document `SteamLocalDbEntry`.
// TODO Create schema for `SteamLocalDbEntry`.
/**
 * Describes a Steam LevelDB database entry.
 */
export interface SteamLocalDbEntry {

  /**
   * Determines whether or not the database entry is "deleted".
   *
   * Deleted items do not appear in the UI. `undefined` is equivalent to
   * `false.`
   *
   * @var {boolean | undefined}
   */
  isDeleted?: boolean;

  /**
   * Database entry key.
   *
   * @var {string}
   */
  key: string;
  namespaceKey: string;

  /**
   * Database modification timestamp.
   *
   * @var {number}
   */
  timestamp: number;

  /**
   * Database entry value.
   *
   * @var {any | undefined}
   */
  value?: any;

  /**
   * Database entry version.
   *
   * @var {string | undefined}
   */
  version?: string;
}

/**
 * Refers to a specific entry within the Steam library DB.
 */
export type SteamLocalDbEntryLocation = {
  /**
   * Namespace key for entry.
   */
  namespaceKey: string;

  /**
   * Key for entry.
   */
  entryKey: string;
};

// TODO Add unit tests for `SteamLocalDb` class.
// TODO Improve `SteamLocalDb` handling when DB connection is not open.
/**
 * Steam local DB reader and writer.
 */
export class SteamLocalDb {
  /**
   * Steam LevelDB database instance.
   */
  private db: Level;

  /**
   * Steam LevelDB key prefix.
   */
  private prefix: string;

  /**
   * Constructor.
   *
   * @param {string} dbPath - Path to steam library database.
   * @param {number} steamId - ID of the steam user for DB.
   */
  constructor(dbPath: string, steamId: number) {
    this.prefix = `_https://steamloopback.host\u0000\u0001U${steamId}-cloud-storage-namespace`;
    // TODO Define and throw error for Level DB open error, especially if locked.
    this.db = new Level(dbPath, { valueEncoding: 'hex' });
  }

  /**
   * Returns an array of keys for Steam DB entries.
   *
   * @return {Promise<string[]>} Promise that resolves to an array of strings.
   */
  async getNamespaceKeys(): Promise<string[]> {
    const namespaceData = await this.db.get(`${this.prefix}s`, {
      valueEncoding: 'utf-8',
    });
    const namespaceValues = decodeDbValue(namespaceData);
    return namespaceValues.map((namespaceValue: any) => {
      return `${this.prefix}-${namespaceValue[0]}`;
    });
  }

  /**
   * Gets the last (i.e. highest) namespace key for this DB.
   *
   * @returns {Promise<string>} Promise that resolves to last namespace key.
   */
  async getLastNamespaceKey(): Promise<string> {
    const keys = await this.getNamespaceKeys();
    return keys.slice(-1)[0];
  }

  /**
   * Gets the entry with the given namespace key and entry key.
   *
   * @param {string} namespaceKey - Namespace key.
   * @param {string} entryKey - Entry key.
   *
   * @returns {Promise<SteamLocalDbEntry>} Resolves to DB entry, or rejects if not found.
   */
  async getEntry(
    namespaceKey: string,
    entryKey: string,
  ): Promise<SteamLocalDbEntry> {
    const entries = await this.getEntriesForNamespace(namespaceKey);
    const index = entries.findIndex((entry: SteamLocalDbEntry) => {
      return entry.key === entryKey;
    });

    if (index === -1) {
      throw new Error(
        `No Steam DB entry with namespace key '${namespaceKey}' and entry key '${entryKey}' exists.`,
      );
    }

    return entries[index];
  }

  /**
   * Sets an entry for the given namespace.
   *
   * If an entry with the given key already exists, it will be overwritten.
   * Otherwise, it will be added.
   *
   * @param {string} namespaceKey - Key for namespace for which to set entry.
   * @param {SteamLocalDbEntry} entry - Entry to set.
   *
   * @returns {Promise<void>} Promise that resolves when
   */
  async setEntryForNamespace(
    namespaceKey: string,
    entry: SteamLocalDbEntry,
  ): Promise<void> {
    this.updateEntriesForNamespace(namespaceKey, [entry]);
  }

  /**
   * Gets all entries in the Steam library DB.
   *
   * @returns {Promise<SteamLocalDbEntry[]}
   */
  async getEntries(): Promise<SteamLocalDbEntry[]> {
    const namespaces = await this.getNamespaceKeys();
    const getPromises = namespaces.map((namespace: string) => {
      return this.getEntriesForNamespace(namespace);
    });

    const entryArrays = await Promise.all(getPromises);
    return entryArrays.reduce(
      (acc: SteamLocalDbEntry[], cur: SteamLocalDbEntry[]) => {
        acc.push(...cur);
        return acc;
      },
      [],
    );
  }

  /**
   * Returns an array of Steam DB entries for the given key.
   *
   * @param {string} namespaceKey - Key for entries to retrieve.
   *
   * @returns {Promise<SteamLocalDbEntry>[]} Promise that resolves to array of Steam DB entries.
   */
  async getEntriesForNamespace(
    namespaceKey: string,
  ): Promise<SteamLocalDbEntry[]> {
    const entryData = await this.db.get(namespaceKey, {
      valueEncoding: 'utf-8',
    });
    const entriesRaw = decodeDbValue(entryData);

    return entriesRaw.map((entry: any[]): SteamLocalDbEntry => {
      const dbEntry = entry[1] as rawDbEntry;
      return {
        namespaceKey,
        key: dbEntry.key,
        isDeleted: dbEntry.is_deleted,
        value: dbEntry.value,
        timestamp: dbEntry.timestamp,
        version: dbEntry.version,
      };
    });
  }

  /**
   * Sets Steam DB entries for the given key, replacing existing entries.
   *
   * @param {string} namespaceKey - Steam DB key for which to set entries.
   * @param {SteamLocalDbEntry[]} entries - Entries to set.
   *
   * @returns {Promise<void>} Promise that resolves when entries are set.
   */
  async setEntriesForNamespace(
    namespaceKey: string,
    entries: SteamLocalDbEntry[],
  ): Promise<void> {
    const entryValues = entries
      .map((entry) => {
        if (entry.namespaceKey !== namespaceKey) {
          return undefined;
        }

        const rawEntry: rawDbEntry = {
          is_deleted: entry.isDeleted,
          key: entry.key,
          value: entry.value,
          timestamp: entry.timestamp,
          version: entry.version,
        };

        return [entry.key, rawEntry];
      })
      .filter((entry) => {
        return entry !== undefined;
      });

    // TODO Consider defining and using error if entries are malformed.
    const entryData = encodeDbValue(entryValues);
    return this.db.put(namespaceKey, entryData);
  }

  /**
   * Sets entries across namespaces.
   *
   * This replaces all database entries for each namespace that gets modified.
   *
   * @param {SteamLocalDbEntry[]} entries - Database entries to set.
   *
   * @returns {Promise<void>} Promise that resolves when entries are set.
   */
  async setEntries(entries: SteamLocalDbEntry[]): Promise<void> {
    const namespaces = entries.reduce(
      (acc: string[], cur: SteamLocalDbEntry) => {
        if (acc.includes(cur.namespaceKey)) {
          return acc;
        }
        return [...acc, cur.namespaceKey];
      },
      [],
    );

    const entrySetPromises = namespaces.map((namespace: string) => {
      const filteredEntries = entries.filter((entry: SteamLocalDbEntry) => {
        return entry.namespaceKey === namespace;
      });

      return this.setEntriesForNamespace(namespace, filteredEntries);
    });

    await Promise.all(entrySetPromises);
  }

  /**
   * Updates Steam DB entries for the given key.
   *
   * This updates entries and adds new entries as needed, without impacting any
   * other existing entries.
   *
   * @param {string} namespaceKey - Steam DB key for which to set entries.
   * @param {SteamLocalDbEntry[]} entries - Entries to update.
   *
   * @returns {Promise<void>} Promise that resolves when entries are updated.
   */
  async updateEntriesForNamespace(
    namespaceKey: string,
    entries: SteamLocalDbEntry[],
  ): Promise<void> {
    const oldEntryData = await this.getEntriesForNamespace(namespaceKey);
    const newEntryData = entries.reduce(
      (acc: SteamLocalDbEntry[], cur: SteamLocalDbEntry) => {
        const index = acc.findIndex((entry: SteamLocalDbEntry) => {
          return entry.key === cur.key;
        });

        if (index === -1) {
          acc.push(cur);
        } else {
          acc[index] = cur;
        }

        return acc;
      },
      oldEntryData,
    );

    this.setEntriesForNamespace(namespaceKey, newEntryData);
  }

  /**
   * Updates Steam DB across namespaces.
   *
   * This will update any existing entries in the given namespaces as needed,
   * but otherwise will not modify existing entries.
   *
   * @param {SteamLocalDbEntry[]} entries - Database entries to update.
   *
   * @returns {Promise<void>} Promise that resolves when entities are updated.
   */
  async updateEntries(entries: SteamLocalDbEntry[]): Promise<void> {
    const namespaces = entries.reduce(
      (acc: string[], cur: SteamLocalDbEntry) => {
        if (acc.includes(cur.namespaceKey)) {
          return acc;
        }
        return [...acc, cur.namespaceKey];
      },
      [],
    );

    const entryUpdatePromises = namespaces.map((namespace: string) => {
      const filteredEntries = entries.filter((entry: SteamLocalDbEntry) => {
        return entry.namespaceKey === namespace;
      });

      return this.updateEntriesForNamespace(namespace, filteredEntries);
    });

    await Promise.all(entryUpdatePromises);
  }

  /**
   * Deletes the entry with the given key in the given namespace.
   *
   * If an entry is deleted, a Promise is returned which resolves to `true`.
   * Otherwise, the Promise resolves to `false`.
   *
   * @param {string} namespaceKey - Steam DB namespace key.
   * @param {string} entryKey - Steam DB entry key.
   *
   * @returns {Promise<boolean>} Deletion promise.
   */
  async deleteEntryForNamespace(
    namespaceKey: string,
    entryKey: string,
  ): Promise<boolean> {
    try {
      const entry = await this.getEntry(namespaceKey, entryKey);
      const deletionEntry: SteamLocalDbEntry = {
        namespaceKey: namespaceKey,
        key: entryKey,
        timestamp: createTimestamp(),
        isDeleted: true,
        version: entry.version,
      };

      await this.setEntryForNamespace(namespaceKey, deletionEntry);
    } catch (_e: unknown) {
      return false;
    }
    return true;
  }

  /**
   * Closes the Steam DB database connection.
   */
  close(): void {
    this.db.close();
  }
}
