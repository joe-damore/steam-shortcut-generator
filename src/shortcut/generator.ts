import { VdfMap, writeVdf } from 'steam-binary-vdf';
import { Shortcut } from './shortcut';
import { arrayify, booleanToNumber, arrayToIndexedMap } from '../util';

// TODO Add unit tests for `generateShortcutVdfData()`.
/**
 * Generates binary shortcut VDF data from a Shortcut or an array of Shortcuts.
 *
 * @param {Shortcut | Shortcut[]} shortcut - Shortcut or shortcuts from which to get VDF data.
 *
 * @returns {Buffer} Binary shortcut VDF data.
 */
export const generateShortcutVdfData = (
  shortcut: Shortcut | Shortcut[],
): Buffer => {
  const shortcuts = arrayify(shortcut);
  const vdfShortcuts = shortcuts.map((item: Shortcut) => {
    return {
      appId: item.getAppId(),
      AppName: item.name,
      Exe: item.execBin,
      StartDir: item.execCwd,
      // TODO Handle VDF `icon` parameter.
      icon: '',
      // TODO Examine whether `ShortcutPath` should be exposed in shortcut file schema.
      ShortcutPath: '',
      LaunchOptions: item.execArgs,
      IsHidden: booleanToNumber(item.hidden),
      // TODO Examine whehter `AllowDesktopConfig` should be exposed in shortcut file schema.
      AllowDesktopConfig: 1,
      OpenVR: booleanToNumber(item.vr),
      // TODO Examine whether to expose `Devkit`, `DevkitGameID`, and `DevkitOverrideAppID`.
      Devkit: 0,
      DevkitGameID: '',
      DevkitOverrideAppID: 0,
      // TODO Examine whether to expose `LastPlayTime` to schema.
      LastPlayTime: 0,
      // TODO Examine whether to expose `FlatpakAppID` to schema.
      FlatpakAppID: '',
      // TODO Tags.
      tags: arrayToIndexedMap(item.tags.sort()),
    };
  });

  const vdfData: VdfMap = {
    shortcuts: arrayToIndexedMap(vdfShortcuts),
  };

  return writeVdf(vdfData);
};
