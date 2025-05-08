import { downloadFile } from "./download-file";
import { exists } from "./exists";
import { removeRecursiveForce } from "./remove-recursive-force";
import { unzip } from "./unzip";

const UTILITIES = [
  {
    downloadUrl:
      "https://github.com/ScoopInstaller/Binary/raw/master/unshield/unshield-1.5.1.7z",
    destination: "unshield",
  },
  {
    downloadUrl:
      "https://github.com/lifenjoiner/ISx/releases/download/v0.3.8/ISx-v0.3.8-win32.7z",
    destination: "ISx",
  },
];

export async function downloadUtilities(): Promise<void> {
  await Promise.all(
    UTILITIES.map(async (utility) => {
      if (await exists(utility.destination + "/")) return;
      const ZIP_PATH = utility.destination + ".7z";

      await downloadFile(utility.downloadUrl, ZIP_PATH);
      await unzip(ZIP_PATH, utility.destination);
      await removeRecursiveForce(ZIP_PATH);
    }),
  );
}
