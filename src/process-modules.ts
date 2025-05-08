import fs from "node:fs/promises";
import { Biome, Distribution } from "@biomejs/js-api";
import { removeRecursiveForce } from "./remove-recursive-force";

const EXPORT_REGEX = /},fn:(['"]).*?\1}\);/;
const REQUIRE_FILENAME_REGEX = /require\((['"])(?<fileName>.*?)\1\);/g;
const REQUIRE_CSS_REGEX = /require\((['"])([^'")]*?\.css)\1\)/g;

const biome = await Biome.create({
  distribution: Distribution.NODE,
});

export async function processModules(
  modulesDirectory: string,
): Promise<number> {
  let time = performance.now();
  let files = await fs.readdir(modulesDirectory);
  files = files.filter((file) => file.endsWith("_JS"));

  await removeRecursiveForce("modules"); // Remove old modules directory if it exists.
  await fs.mkdir("modules/unused", { recursive: true });

  const realFileNames: Record<string, string> = {};
  const modules: Record<string, string> = {};

  await Promise.all(
    files.map(async (fileName) => {
      let rawContent = await fs.readFile(
        `${modulesDirectory}/${fileName}`,
        "utf8",
      );

      // Remove every CSS imports.
      rawContent = rawContent.replace(REQUIRE_CSS_REGEX, "");

      // Remove spaces at start and end.
      rawContent = rawContent.trim();

      // Remove some wrapping from bundlers, useless for us.
      rawContent = rawContent.replace(
        'Object.defineProperty(exports,"__esModule",{value:true});',
        "",
      );

      if (rawContent.startsWith("IE.fModule")) {
        // e.g.: `IE.fModule({f:function(exports,require,module,global){` : 54 chars long
        rawContent = rawContent.substring(54);

        // e.g.: `{ ... },fn:'_cache.js'});` // note the first { is removed from above.
        rawContent = rawContent.replace(EXPORT_REGEX, "");
      }

      if (rawContent.startsWith('"use ')) {
        // `"use strict;" : 13 chars long
        rawContent = rawContent.substring(13);
      }

      // Get all JS imports and save the names to a map for later usage.
      [...rawContent.matchAll(REQUIRE_FILENAME_REGEX)].forEach((match) => {
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

      const { content } = biome.formatContent(rawContent, {
        filePath: fileName + ".js",
      });

      modules[fileName] = content;
    }),
  );

  // Try to match all the lowercased file names with imports map.
  await Promise.all(
    Object.entries(modules).map(async ([lowercasedFileName, content]) => {
      let realFileName = realFileNames[lowercasedFileName];

      if (!realFileName) {
        realFileName = "unused/" + lowercasedFileName;
      }

      await fs.writeFile(`modules/${realFileName}.js`, content, "utf8");
      console.log(`+ ${lowercasedFileName}.js -> ${realFileName}.js`);
    }),
  );

  return files.length;
}
