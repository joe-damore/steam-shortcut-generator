/**
 * @file Class to modify Steam categories.
 */

import { SteamCategory } from './categories';
import { createCollectionId, createCollectionKey } from './categories';

// TODO Document `CategoryEditor`.
// TODO Add unit tests for `CategoryEditor` class.
export class CategoryEditor {
  private categories: SteamCategory[];

  constructor(categories: SteamCategory[]) {
    this.categories = categories;
  }

  public findCategoryByName(categoryName: string): SteamCategory | undefined {
    return this.categories.find((category: SteamCategory) => {
      return category.data && category.data.name === categoryName;
    });
  }

  public createCategory(
    categoryName: string,
    gameIds: number[],
  ): SteamCategory {
    if (this.findCategoryByName(categoryName)) {
      throw new Error(
        `Failed to create category; a category named '${categoryName}' already exists.`,
      );
    }

    const newCategory = {
      entryKey: createCollectionKey(categoryName),
      data: {
        id: createCollectionId(categoryName),
        name: categoryName,
        added: gameIds.length ? gameIds : undefined,
      },
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  public addGamesForCategory(categoryName: string, gameIds: number[]) {
    const category = this.findCategoryByName(categoryName);
    if (category) {
      // If category is deleted, restore it.
      if (category.isDeleted) {
        category.isDeleted = undefined;
      }

      gameIds.forEach((gameId: number) => {
        if (!category.data) {
          category.data = {
            id: createCollectionId(categoryName),
            name: categoryName,
          };
        }
        if (!category.data.added) {
          category.data.added = [];
        }
        if (!category.data.added.includes(gameId)) {
          category.data.added.push(gameId);
        }
      });
    } else {
      this.createCategory(categoryName, gameIds);
    }
  }

  public setGamesForCategory(categoryName: string, gameIds: number[]) {
    const category = this.findCategoryByName(categoryName);
    if (category) {
      // If category is deleted, restore it.
      if (category.isDeleted) {
        category.isDeleted = undefined;
      }

      // If category has no data, add some.
      if (!category.data) {
        category.data = {
          id: createCollectionId(categoryName),
          name: categoryName,
        };
      }

      category.data.added = gameIds;
    } else {
      this.createCategory(categoryName, gameIds);
    }
  }

  public getCategories(): SteamCategory[] {
    return this.categories;
  }
}
