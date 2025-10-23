#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Detect which runtime to use
let runtime = 'node';

if (fs.existsSync('.runtime-preference')) {
  runtime = fs.readFileSync('.runtime-preference', 'utf-8').trim();
}

console.log(`🔧 Using runtime: ${runtime}`);

try {
  switch (runtime) {
    case 'bun':
      execSync('bun run src/build.ts', { stdio: 'inherit' });
      break;
    case 'deno':
      execSync('deno run --allow-read --allow-run --allow-env src/build.ts', { stdio: 'inherit' });
      break;
    case 'node':
      execSync('npx tsx src/build.ts', { stdio: 'inherit' });
      break;
    default:
      throw new Error(`Unknown runtime: ${runtime}`);
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}