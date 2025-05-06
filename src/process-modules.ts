import fs from "node:fs/promises";
import * as prettier from "prettier";
import { removeRecursiveForce } from "./remove-recursive-force";

const EXPORT_REGEX = /},fn:(['"]).*?\1}\);/;

export async function processModules(modulesDirectory: string): Promise<number> {
  let files = await fs.readdir(modulesDirectory);
  files = files.filter((file) => file.endsWith("_JS"));

  await removeRecursiveForce("modules"); // Remove old modules directory if it exists.
  await fs.mkdir("modules");

  await Promise.all(files.map(async (fileName) => {
    let rawContent = await fs.readFile(`${modulesDirectory}/${fileName}`, "utf8");
    rawContent = rawContent.trim();

    // Remove some wrapping from bundlers, useless for us.
    rawContent = rawContent.replace('Object.defineProperty(exports,"__esModule",{value:true});', "");

    if (rawContent.startsWith("IE.fModule")) {
      // e.g.: `IE.fModule({f:function(exports,require,module,global){` : 54 chars long
      rawContent = rawContent.substring(54);

      // e.g.: `{ ... },fn:'_cache.js'});` // note the first { is removed from above.
      rawContent = rawContent.replace(EXPORT_REGEX, "");
    }

    if (rawContent.startsWith('"use ')) { // `"use strict;" : 13 chars long
      rawContent = rawContent.substring(13);
    }

    const formattedContent = await prettier.format(rawContent, { parser: "babel" })
      .catch((error) => {
        console.error(`Error formatting ${fileName}, see the stack frame below`, rawContent.substring(0, 100), "...", rawContent.substring(rawContent.length - 100, rawContent.length));
        throw error;
      });

    const realFileName = fileName
      .replace(/^WEB_/, "")
      .replace(/_JS$/, ".js")
      .toLowerCase();

    await fs.writeFile(`modules/${realFileName}`, formattedContent, "utf8");
    console.log(`+ ${fileName} -> ${realFileName}`);
  }))

  return files.length;
}
