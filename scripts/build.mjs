import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'dist');
const pagesOutput = resolve(root, 'docs');

await rm(output, { recursive: true, force: true });
await rm(pagesOutput, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, 'src'), output, { recursive: true });
await cp(resolve(root, 'public'), resolve(output, 'assets'), { recursive: true });
await cp(output, pagesOutput, { recursive: true });

console.log('MGM prototype built successfully in dist/ and mirrored to docs/ for GitHub Pages');
