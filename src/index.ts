import { program } from 'commander';
import { lstatSync, writeFileSync } from 'fs';
import { copyArtworkForShortcutSync } from './art/copy-art-file';
import { generateShortcutVdfData, Shortcut } from './shortcut';
import { ShortcutLoader } from './shortcut/loader';
import {
  getAllCategoryNamesFromShortcuts,
  getAllShortcutGameIdsForCategory,
} from './categories/categories';
import { CategoryEditor } from './categories/category-editor';
import { CategoryManager } from './categories/category-manager';

// TODO Retrieve version from package.json.
program
  .name('steam-shortcut-generator')
  .description('Generate Steam shortcuts from files')
  .version('0.1.0')
  .argument('<src>', 'file or directory from which to generate shortcuts')
  .argument('<dest>', 'output file path for generated shortcuts VDF file')
  .option('-a, --art <path>', 'path to output shortcuts artwork')
  .option('-l, --leveldb <path>', 'path to Steam library LevelDB');

program.parse();

const main = async () => {
  const { art, leveldb } = program.opts();
  const src = program.args[0];
  const dest = program.args[1];

  try {
    const srcStat = lstatSync(src);
    const srcShortcuts: Shortcut[] = (() => {
      if (srcStat.isFile()) {
        return [ShortcutLoader.loadFromFileSync(src)];
      }
      if (srcStat.isDirectory()) {
        return ShortcutLoader.loadFromDirRecursiveSync(src);
      }
      throw new Error('Given `src` value is neither a file nor a directory');
    })();

    const vdfData = generateShortcutVdfData(srcShortcuts, art);
    if (art) {
      srcShortcuts.forEach((srcShortcut: Shortcut) => {
        copyArtworkForShortcutSync(srcShortcut, art);
      });
    }

    if (leveldb) {
      try {
        const categoryManager = new CategoryManager(leveldb, 65000521);
        const categories = await categoryManager.getCategories();

        const categoryNames = getAllCategoryNamesFromShortcuts(srcShortcuts);
        const categoryEditor = new CategoryEditor(categories);
        categoryNames.forEach((categoryName: string) => {
          const gameIds = getAllShortcutGameIdsForCategory(
            srcShortcuts,
            categoryName,
          );
          categoryEditor.addGamesForCategory(categoryName, gameIds);
        });

        categoryManager.setCategories(categoryEditor.getCategories());
      } catch (e: unknown) {
        throw e;
      }
    }

    writeFileSync(dest, vdfData);
  } catch (e: unknown) {
    // TODO Show error message.
    console.log(e);
    console.error('An error has occurred. Good bye. :/');
    process.exit(1);
  }
};

main();
