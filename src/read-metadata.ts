import { readFile } from "node:fs/promises";

export async function readVersionFromMetadata(path: string): Promise<string> {
  const content = await readFile(path, "utf16le");
  const lines = content.split("\r\n");

  // e.g.: `VALUE "ProductVersion",    "2024.3.11.0"`
  let versionLine = lines.find((line) =>
    line.includes('VALUE "ProductVersion",'),
  );

  if (!versionLine) {
    throw new Error("Version line not found in metadata");
  }

  // Remove all spaces.
  // e.g: `VALUE"ProductVersion","2024.3.11.0"`
  versionLine = versionLine.replaceAll(" ", "");

  // e.g: `"2024.3.11.0"`
  const versionWithQuotes = versionLine.split(",")[1];

  // Remove quotes.
  // e.g: `2024.3.11.0`
  return versionWithQuotes.replaceAll('"', "");
}
