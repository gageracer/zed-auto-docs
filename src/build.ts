#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Read saved runtime preference
let runtime = 'node'; // default

if (fs.existsSync('.runtime-preference')) {
  runtime = fs.readFileSync('.runtime-preference', 'utf-8').trim();
}

console.log(`🔨 Building with ${runtime}...`);

try {
  switch (runtime) {
    case 'bun':
      execSync('bun build src/extension.ts --outdir dist --target node', { stdio: 'inherit' });
      break;
    case 'deno':
      execSync('deno bundle src/extension.ts dist/extension.js', { stdio: 'inherit' });
      break;
    case 'node':
      execSync('npx esbuild src/extension.ts --bundle --platform=node --outfile=dist/extension.js', { stdio: 'inherit' });
      break;
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
