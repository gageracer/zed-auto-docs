#!/bin/bash
echo "🚀 Setting up Zed Auto-Docs Extension..."
if ! command -v bun &> /dev/null; then
    echo "⚠️  Bun not found. Install from: https://bun.sh"
    exit 1
fi
echo "✅ Bun found"
echo "📦 Installing dependencies..."
bun install
echo "🔨 Building extension..."
bun run build
echo "✨ Setup complete!"