import fs from "node:fs/promises";
import { Biome } from "@biomejs/js-api/nodejs";
import { removeRecursiveForce } from "./remove-recursive-force";

const EXPORT_REGEX = /},fn:(['"]).*?\1}\);/;
const REQUIRE_FILENAME_REGEX = /require\((['"])(?<fileName>.*?)\1\);/g;
const REQUIRE_CSS_REGEX =
  /(const\s+\w+\s*=\s*)?require\((['"])([^'"]*?\.css)\2\);/g;

const biome = new Biome();
export async function processModules(
  modulesDirectory: string
): Promise<number> {
  let files = await fs.readdir(modulesDirectory);
  files = files.filter((file) => file.endsWith("_JS"));

  await removeRecursiveForce("modules"); // Remove old modules directory if it exists.
  await fs.mkdir("modules/unused", { recursive: true });

  const { projectKey } = biome.openProject("modules");

  const realFileNames: Record<string, string> = {};
  const modules: Record<string, string> = {};

  await Promise.all(
    files.map(async (fileName) => {
      let raw = await Bun.file(`${modulesDirectory}/${fileName}`).text();

      // Remove every CSS imports.
      raw = raw.replace(REQUIRE_CSS_REGEX, "");

      // Remove spaces at start and end.
      raw = raw.trim();

      // Remove some wrapping from bundlers, useless for us.
      raw = raw.replace(
        'Object.defineProperty(exports,"__esModule",{value:true});',
        ""
      );

      if (raw.startsWith("IE.fModule")) {
        // e.g.: `IE.fModule({f:function(exports,require,module,global){` : 54 chars long
        raw = raw.substring(54);

        // e.g.: `{ ... },fn:'_cache.js'});` // note the first { is removed from above.
        raw = raw.replace(EXPORT_REGEX, "");
      }

      if (raw.startsWith('"use ')) {
        // `"use strict;" : 13 chars long
        raw = raw.substring(13);
      }

      // Get all JS imports and save the names to a map for later usage.
      [...raw.matchAll(REQUIRE_FILENAME_REGEX)].forEach((match) => {
        let fileName = match.groups!.fileName;
        fileName = fileName.replace(/\.js$/, "");
        realFileNames[fileName.toLowerCase()] = fileName;
      });

      fileName = fileName
        .replace(/^WEB_/, "")
        .replace(/_MOINS_/g, "-")
        .replace(/_MIN/, ".min")
        .replace(/_JS$/, "")
        .toLowerCase();

      const { content } = biome.formatContent(projectKey, raw, {
        filePath: fileName + ".js",
      });

      modules[fileName] = content;
    })
  );

  // Try to match all the lowercased file names with imports map.
  await Promise.all(
    Object.entries(modules).map(async ([lowercasedFileName, content]) => {
      let realFileName = realFileNames[lowercasedFileName];

      if (!realFileName) {
        realFileName = "unused/" + lowercasedFileName;
      }

      await Bun.write(`modules/${realFileName}.js`, content);
      console.log(`+ ${lowercasedFileName}.js -> ${realFileName}.js`);
    })
  );

  return files.length;
}
