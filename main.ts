// Entry point for the makefun-x-reposts-02 submission.
//
// The actual entry is a set of posts I published on X (quote posts and
// replies, each one answering a different recent post from make.fun, all
// from a single public account). Those post URLs live in POSTS.json next
// to this file. This program's only job is to deliver that list to the
// grader: it reads POSTS.json from the bot directory and writes it into
// the output directory, unchanged.
//
// Run locally:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const sourcePath = join(botDir, "POSTS.json");
const targetPath = join(outputDir, "POSTS.json");

let raw: string;
try {
  raw = readFileSync(sourcePath, "utf8");
} catch (err) {
  console.error(`cannot read ${sourcePath}: ${(err as Error).message}`);
  process.exit(1);
}

// Validate the list before handing it over. Every entry has to be the
// canonical URL of a single X post, the list must hold between 1 and 15
// entries, and duplicates are dropped (first occurrence wins). Anything
// malformed aborts the run instead of silently shipping a bad list.
const POST_URL = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;

function fail(reason: string): never {
  console.error(`invalid POSTS.json: ${reason}`);
  process.exit(1);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  fail(`not valid JSON (${(err as Error).message}`);
}

const postsField = (parsed as { posts?: unknown } | null)?.posts;
if (!Array.isArray(postsField)) {
  fail(`"posts" must be an array`);
}

const seen = new Set<string>();
const posts: string[] = [];
for (const entry of postsField) {
  if (typeof entry !== "string" || !POST_URL.test(entry)) {
    fail(`entry is not an X post URL: ${JSON.stringify(entry)}`);
  }
  if (!seen.has(entry)) {
    seen.add(entry);
    posts.push(entry);
  }
}
if (posts.length < 1 || posts.length > 15) {
  fail(`expected 1-15 posts after de-duplication, got ${posts.length}`);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(targetPath, JSON.stringify({ posts }, null, 2) + "\n");
console.log(`copied ${posts.length} post URL(s) to ${targetPath}`);
