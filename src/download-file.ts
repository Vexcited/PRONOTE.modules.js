import { writeFile } from "node:fs/promises";
import { exists } from "./exists";

export async function downloadFile(
  url: string,
  fileName: string,
): Promise<void> {
  if (await exists(fileName)) {
    return;
  }

  console.log(`Requesting ${fileName}...`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  console.log(`Receiving ${fileName}...`);
  const buffer = await response.arrayBuffer();

  console.log(`Writing ${fileName}...`);
  await writeFile(fileName, Buffer.from(buffer));
}
