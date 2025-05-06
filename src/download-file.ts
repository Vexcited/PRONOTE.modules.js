import { writeFile } from "node:fs/promises";
import { exists } from "./exists";

export async function downloadFile(url: string, fileName: string): Promise<void> {
  if (await exists(fileName)) {
    console.log(`File ${fileName} already exists. Skipping download.`);
    return;
  }

  console.log(`Downloading ${fileName}...`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  console.log(`Writing ${fileName}...`);
  const buffer = await response.arrayBuffer();
  await writeFile(fileName, Buffer.from(buffer));
}
