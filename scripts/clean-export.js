/**
 * After static export, recursively delete `.txt` files under `out/`, except `robots.txt` (any case).
 * If `out/` is missing, exit successfully.
 */

const fs = require("fs/promises");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "out");

function isTxtFile(name) {
  return name.toLowerCase().endsWith(".txt");
}

function isPreservedRobotsTxt(name) {
  return name.toLowerCase() === "robots.txt";
}

async function walkAndClean(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkAndClean(fullPath);
    } else if (
      entry.isFile() &&
      isTxtFile(entry.name) &&
      !isPreservedRobotsTxt(entry.name)
    ) {
      await fs.unlink(fullPath);
    }
  }
}

async function main() {
  let stat;
  try {
    stat = await fs.stat(OUT_DIR);
  } catch (err) {
    if (err && err.code === "ENOENT") return;
    throw err;
  }
  if (!stat.isDirectory()) return;
  await walkAndClean(OUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
