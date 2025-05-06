import fs from "node:fs/promises";

export async function exists (path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
