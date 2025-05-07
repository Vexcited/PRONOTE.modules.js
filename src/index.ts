import { downloadFile } from "./download-file";
import { downloadUtilities } from "./download-utilities";
import { grabDownloadUrl } from "./grab-url";
import { spawn } from "bun";
import { unzip } from "./unzip";
import { removeRecursiveForce } from "./remove-recursive-force";
import { readVersionFromMetadata } from "./read-metadata";
import { processModules } from "./process-modules";

// Make sure we have all the binaries to proceed.
await downloadUtilities();

// Grab the URL to download the setup.
const downloadUrl = await grabDownloadUrl();
await downloadFile(downloadUrl, "setup.exe");

// Extract CAB file from the setup executable.
await removeRecursiveForce("setup_u"); // Clean up any previous extraction.
const setupExtractionProcess = spawn([".\\ISx\\ISx.exe", "setup.exe"]);
if ((await setupExtractionProcess.exited) !== 0) {
  throw new Error(`Failed to extract the setup executable`);
}

// Extract the CAB file.
await removeRecursiveForce("data2"); // Clean up any previous extraction.
const cabExtractionProcess = spawn([
  ".\\unshield\\unshield.exe",
  "-d",
  "data2",
  "x",
  "setup_u/disk1/data2.cab",
]);

if ((await cabExtractionProcess.exited) !== 0) {
  throw new Error(`Failed to extract the CAB file`);
}

const pronoteNetExe = "data2\\exe\\PRONOTE.net.exe";
await removeRecursiveForce("PRONOTE"); // Clean up any previous extraction.
await unzip(pronoteNetExe, "PRONOTE");
console.log("PRONOTE.NET has been extracted to PRONOTE/ directory.");

const modulesLength = await processModules("PRONOTE\\.rsrc\\1036\\RCDATA");
const version = await readVersionFromMetadata(
  "PRONOTE\\.rsrc\\1033\\version.txt",
);

console.log(
  `Done! Processed ${modulesLength} modules within version ${version}`,
);
