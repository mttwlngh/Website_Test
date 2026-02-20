import { readFile } from "node:fs/promises";
import { exit } from "node:process";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

const requiredSnippets = [
  "id=\"testauswahl\"",
  ">Anleitungen<",
  ">Bilder<",
  "bilder-sti-pro",
  "tab-sti-pro"
];

const missing = requiredSnippets.filter((snippet) => !html.includes(snippet));

if (missing.length) {
  console.error("Smoke check failed. Missing snippets:", missing.join(", "));
  exit(1);
}

console.log("Smoke check passed: navigation and tabs are present.");
