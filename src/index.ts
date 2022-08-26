import { program } from 'commander';
import { lstatSync, writeFileSync } from 'fs';
import { copyArtworkForShortcutSync } from './art/copy-art-file';
import { generateShortcutVdfData, Shortcut } from './shortcut';
import { ShortcutLoader } from './shortcut/loader';

// TODO Retrieve version from package.json.
program
  .name('steam-shortcut-generator')
  .description('Generate Steam shortcuts from files')
  .version('0.1.0')
  .argument('<src>', 'File or directory from which to generate shortcuts')
  .argument('<dest>', 'Output file path for generated shortcuts VDF file')
  .option('-a, --art <path>', "path to output shortcuts artwork");

program.parse();
const { art } = program.opts();
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

  writeFileSync(dest, vdfData);
}
catch (e: unknown) {
  // TODO Show error message.
  console.error('An error has occurred. Good bye. :/');
  console.log(e);
}

