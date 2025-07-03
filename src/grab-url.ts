import * as cheerio from "cheerio";

const FRONT_PAGE_URL =
  "https://www.index-education.com/fr/telecharger-pronote-pre-version.php";

export async function grabDownloadUrl(): Promise<string> {
  const response = await fetch(FRONT_PAGE_URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const links = $("a.btn.btn-sm.btn-primary")
    .map((_, link) => $(link).attr("href"))
    .toArray()
    .filter(
      // Make sure we don't grab any random <a> element.
      (link) => link.startsWith("https://tele") && link.endsWith(".exe"),
    );

  // We only care about PRONOTE.NET executable.
  const downloadUrl = links.find((link) => link.includes("PRNnet"));
  if (!downloadUrl) throw new Error("No download URL for PRONOTE.NET");

  return downloadUrl;
}
