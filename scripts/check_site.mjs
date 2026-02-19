import { readFile } from "node:fs/promises";
import { exit } from "node:process";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

if (!html.includes("DOCTOR BOX")) {
  console.error("Expected 'DOCTOR BOX' in index.html");
  exit(1);
}

console.log("Check passed: 'DOCTOR BOX' found in index.html");
