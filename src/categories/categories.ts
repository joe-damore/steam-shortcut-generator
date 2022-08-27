/**
 * @file Utilities to manage shortcut collections.
 */

import { Shortcut } from '../shortcut';
import { Level } from 'level';

// TODO Add unit tests for 'getAllShortcutCategories()'.
/**
 * Gets all tags from all of the given shortcuts.
 *
 * @param {Shortcut[]} shortcuts - Shortcuts from which to retrieve tags.
 *
 * @returns {string[]} Array of tags from shortcuts.
 */
export const getAllShortcutCategories = (shortcuts: Shortcut[]): string[] => {
  return shortcuts.reduce((acc: string[], cur: Shortcut) => {
    // Use spread syntax with `Set` to remove duplicates.
    return [
      ...new Set([
        ...acc,
        ...cur.tags,
      ])
    ];
  }, []).sort();
};
