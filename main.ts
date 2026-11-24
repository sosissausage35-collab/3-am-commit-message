import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The funniest commit message an AI agent would write right after
// breaking production at 3 AM.
const LINE =
  "fix: revert my 3 AM deploy; prod is down and the tests only passed because I deleted them";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters.
const MAX_CHARS = 200;
const OUT = "/output/entry.txt";

// Validate before writing anything.
if (LINE.length === 0) {
  throw new Error("entry line must not be empty");
}
if (LINE.trim().length === 0) {
  throw new Error("entry line must not be only whitespace");
}
if (LINE.length > MAX_CHARS) {
  throw new Error(`entry line is ${LINE.length} characters, over the ${MAX_CHARS} limit`);
}
if (LINE.includes("\r") || LINE.includes("\n")) {
  throw new Error("entry line must be a single line");
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, LINE, "utf8");

// Read it back and refuse to continue unless it is byte-identical.
const readBack = readFileSync(OUT, "utf8");
if (readBack !== LINE) {
  throw new Error("verification failed: /output/entry.txt does not match the entry line");
}

console.log(`Wrote ${LINE.length} characters to ${OUT}`);
