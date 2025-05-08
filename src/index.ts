import { downloadFile } from "./download-file";
import { downloadUtilities } from "./download-utilities";
import { grabDownloadUrl } from "./grab-url";
import { unzip } from "./unzip";
import { removeRecursiveForce } from "./remove-recursive-force";
import { readVersionFromMetadata } from "./read-metadata";
import { processModules } from "./process-modules";
import { useUtility } from "./use-utility";
import path from "node:path";
import { writeFile } from "node:fs/promises";

await Promise.all([
  // Make sure we have all the binaries to proceed.
  downloadUtilities(),
  // Grab the URL to download the setup.
  grabDownloadUrl().then((url) => downloadFile(url, "setup.exe")),
]);

console.log("Utilities and setup are downloaded, let's start processing...");

// Extract CAB file from the setup executable.
await removeRecursiveForce("setup_u"); // Clean up any previous extraction.
await useUtility("isx", ["setup.exe"]);

// Extract the CAB file.
await removeRecursiveForce("data2"); // Clean up any previous extraction.
await useUtility("unshield", ["-d", "data2", "x", "setup_u/disk1/data2.cab"]);

await removeRecursiveForce("PRONOTE"); // Clean up any previous extraction.
await unzip(path.join("data2", "exe", "PRONOTE.net.exe"), "PRONOTE");
console.log("PRONOTE.NET has been extracted to 'PRONOTE' directory.");

const modulesLength = await processModules(
  path.join("PRONOTE", ".rsrc", "1036", "RCDATA"),
);

const version = await readVersionFromMetadata(
  path.join("PRONOTE", ".rsrc", "1033", "version.txt"),
);

console.log(
  `Done! Processed ${modulesLength} modules within version ${version}`,
);

// Writing the version to a file for easier grabing during CI.
await writeFile("version", version, "utf8");
