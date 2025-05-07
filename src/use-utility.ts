import { spawn } from "bun";
import path from "node:path";

// Make sure to run using wine on other platforms
// since utilities are only available for Windows.
const PREFIX_COMMAND = process.platform === "win32" ? [] : ["wine"];

export async function useUtility(
  name: "isx" | "unshield",
  args: string[],
): Promise<void> {
  let command: string;

  switch (name) {
    case "isx":
      command = path.join("ISx", "ISx.exe");
    case "unshield":
      command = path.join("unshield", "unshield.exe");
  }

  const proc = spawn([...PREFIX_COMMAND, command, ...args]);

  if ((await proc.exited) !== 0) {
    throw new Error(`Failed to run ${command} utility`);
  }
}
