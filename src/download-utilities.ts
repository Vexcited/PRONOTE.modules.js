import { downloadFile } from "./download-file";
import { exists } from "./exists";
import { unzip } from "./unzip";

export async function downloadUtilities(): Promise<void> {
  if (!(await exists("ISx/"))) {
    const ISX_PATH = "isx.7z";
    await downloadFile(
      "https://github.com/lifenjoiner/ISx/releases/download/v0.3.8/ISx-v0.3.8-win32.7z",
      ISX_PATH,
    );
    await unzip(ISX_PATH, "ISx");
  }

  if (!(await exists("unshield/"))) {
    const UNSHIELD_PATH = "unshield.7z";
    await downloadFile(
      "https://github.com/ScoopInstaller/Binary/raw/master/unshield/unshield-1.5.1.7z",
      UNSHIELD_PATH,
    );
    await unzip(UNSHIELD_PATH, "unshield");
  }
}
