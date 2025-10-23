#!/bin/bash

echo "🚀 Setting up Zed Auto-Docs..."

# Make scripts executable
chmod +x .zed/scripts/*.sh
chmod +x .git/hooks/post-commit 2>/dev/null || echo "⚠️  Git hooks will be set up when you initialize git"

# Create docs directory
mkdir -p .docs

# Check dependencies
echo ""
echo "Checking dependencies..."

if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI found"
    if gh copilot --version &> /dev/null 2>&1; then
        echo "✅ GitHub Copilot CLI found"
    else
        echo "⚠️  GitHub Copilot CLI not found. Install with: gh extension install github/gh-copilot"
    fi
else
    echo "⚠️  GitHub CLI not found. Install from: https://cli.github.com/"
fi

if command -v fswatch &> /dev/null; then
    echo "✅ fswatch found (optimal performance)"
elif command -v inotifywait &> /dev/null; then
    echo "✅ inotifywait found (good performance)"
else
    echo "⚠️  No file watcher found. Install fswatch (macOS) or inotify-tools (Linux) for better performance"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the smart watcher: ./.zed/scripts/smart-watcher.sh"
echo "2. Or run in background: nohup ./.zed/scripts/smart-watcher.sh > .docs/watcher.log 2>&1 &"
echo "3. Start coding - documentation will update automatically!"