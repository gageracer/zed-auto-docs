#!/bin/bash

echo "🦀 Building Zed Auto-Docs Extension (Rust)"
echo "=========================================="
echo ""

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust is not installed!"
    echo ""
    echo "Install Rust with:"
    echo "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# Check if wasm32-wasip1 target is installed
if ! rustup target list | grep -q "wasm32-wasip1 (installed)"; then
    echo "📦 Installing wasm32-wasip1 target..."
    rustup target add wasm32-wasip1
fi

echo "🔨 Building extension..."
cargo build --target wasm32-wasip1 --release

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build complete!"
    echo ""
    echo "📌 Next Steps:"
    echo "   1. Open Zed Editor"
    echo "   2. Press cmd-shift-x (Extensions)"
    echo "   3. Click 'Install Dev Extension'"
    echo "   4. Select this directory: $(pwd)"
    echo ""
    echo "📖 Usage:"
    echo "   1. Open Zed Assistant (cmd-')"
    echo "   2. Type: /document path/to/your/file.svelte"
    echo "   3. Zed's AI will generate documentation"
    echo "   4. Copy the result to your README"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi