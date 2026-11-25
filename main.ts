// makefun-x-reposts-02 entry point (Node 22, standard library only).
//
// The entry itself is the X posts listed in POSTS.json: quote posts and
// replies of mine on X, each answering a different one of make.fun's newest
// posts, made from one public account. This program does not score anything
// and does not fetch anything; it only hands POSTS.json to the grader by
// copying it from the repository into the output directory, byte for byte,
// so the gate reads the list exactly as it was submitted.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
try {
  copyFileSync(join(botDir, 'POSTS.json'), join(outputDir, 'POSTS.json'));
} catch (err) {
  console.error(`POSTS.json could not be copied from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
