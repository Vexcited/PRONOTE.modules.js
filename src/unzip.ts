import { spawn } from "bun";

// Since we're running the action on Windows,
// we need to use the Windows version of 7-Zip.
const PATH_7ZIP =
  process.platform === "win32" ? "C:\\Program Files\\7-Zip\\7z.exe" : "7z";

export async function unzip(
  zipPath: string,
  destinationDirectory: string,
): Promise<void> {
  const proc = spawn([
    PATH_7ZIP,
    "x",
    zipPath,
    `-o${destinationDirectory}`,
    "-y",
  ]);

  if ((await proc.exited) !== 0) {
    throw new Error(`Failed to unzip ${zipPath} to ${destinationDirectory}`);
  }
}
