#!/bin/bash

echo "🎮 Zed Auto-Docs Extension Setup"
echo "================================"
echo ""

# Detect available runtime
RUNTIME=""

if command -v bun &> /dev/null; then
    RUNTIME="bun"
    echo "✅ Found: Bun runtime"
elif command -v deno &> /dev/null; then
    RUNTIME="deno"
    echo "✅ Found: Deno runtime"
elif command -v node &> /dev/null; then
    RUNTIME="node"
    echo "✅ Found: Node.js runtime"
else
    echo ""
    echo "❌ No JavaScript runtime detected!"
    echo ""
    echo "Please install one of the following:"
    echo "  • Bun (recommended):  https://bun.sh"
    echo "  • Deno:               https://deno.land"
    echo "  • Node.js:            https://nodejs.org"
    echo ""
    exit 1
fi

echo ""
echo "🔧 Using: $RUNTIME"
echo ""

# Ask user if they want to use detected runtime or choose another
if [ "$RUNTIME" != "" ]; then
    read -p "Use $RUNTIME? (y/n, or specify 'bun'/'deno'/'node'): " choice
    case "$choice" in
        n|N)
            read -p "Which runtime? (bun/deno/node): " manual_runtime
            case "$manual_runtime" in
                bun|deno|node)
                    if command -v "$manual_runtime" &> /dev/null; then
                        RUNTIME="$manual_runtime"
                        echo "✅ Switched to: $RUNTIME"
                    else
                        echo "❌ $manual_runtime not found. Please install it first."
                        exit 1
                    fi
                    ;;
                *)
                    echo "❌ Invalid runtime. Exiting."
                    exit 1
                    ;;
            esac
            ;;
        bun|deno|node)
            if command -v "$choice" &> /dev/null; then
                RUNTIME="$choice"
                echo "✅ Switched to: $RUNTIME"
            else
                echo "❌ $choice not found. Please install it first."
                exit 1
            fi
            ;;
        *)
            echo "✅ Proceeding with: $RUNTIME"
            ;;
    esac
fi

echo ""
echo "📦 Installing dependencies..."

# Install based on runtime
case "$RUNTIME" in
    bun)
        bun install
        if [ $? -eq 0 ]; then
            echo "✅ Dependencies installed with Bun"
        else
            echo "❌ Failed to install dependencies"
            exit 1
        fi
        ;;
    deno)
        echo "ℹ️  Deno doesn't require package installation"
        echo "   Dependencies will be cached on first run"
        ;;
    node)
        if command -v npm &> /dev/null; then
            npm install
            if [ $? -eq 0 ]; then
                echo "✅ Dependencies installed with npm"
            else
                echo "❌ Failed to install dependencies"
                exit 1
            fi
        else
            echo "❌ npm not found. Please install Node.js properly."
            exit 1
        fi
        ;;
esac

echo ""
echo "🔨 Configuring build script for $RUNTIME..."

# Update package.json build script based on runtime
case "$RUNTIME" in
    bun)
        # Use jq or sed to update package.json
        if command -v jq &> /dev/null; then
            jq '.scripts.build = "bun build src/extension.ts --outdir dist --target node"' package.json > package.json.tmp && mv package.json.tmp package.json
        else
            # Fallback: manual string replacement
            sed -i.bak 's/"build": ".*"/"build": "bun build src\/extension.ts --outdir dist --target node"/' package.json
        fi
        ;;
    deno)
        if command -v jq &> /dev/null; then
            jq '.scripts.build = "deno bundle src/extension.ts dist/extension.js"' package.json > package.json.tmp && mv package.json.tmp package.json
        else
            sed -i.bak 's/"build": ".*"/"build": "deno bundle src\/extension.ts dist\/extension.js"/' package.json
        fi
        ;;
    node)
        if command -v jq &> /dev/null; then
            jq '.scripts.build = "npx esbuild src/extension.ts --bundle --platform=node --outfile=dist/extension.js"' package.json > package.json.tmp && mv package.json.tmp package.json
        else
            sed -i.bak 's/"build": ".*"/"build": "npx esbuild src\/extension.ts --bundle --platform=node --outfile=dist\/extension.js"/' package.json
        fi
        ;;
esac

echo "✅ Build script configured!"

echo ""
echo "🔨 Building extension..."

# Build based on runtime
case "$RUNTIME" in
    bun)
        bun run build
        BUILD_STATUS=$?
        ;;
    deno)
        deno task build 2>/dev/null || {
            echo "ℹ️  Running build directly..."
            deno bundle src/extension.ts dist/extension.js
            BUILD_STATUS=$?
        }
        ;;
    node)
        npm run build
        BUILD_STATUS=$?
        ;;
esac

if [ $BUILD_STATUS -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build complete!"
echo ""
echo "📝 Saving runtime preference..."
echo "$RUNTIME" > .runtime-preference

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Runtime: $RUNTIME"
echo ""
echo "📌 Next Steps:"
echo "   1. Open Zed Editor"
echo "   2. Press cmd-shift-x (or ctrl-shift-x)"
echo "   3. Click 'Install Dev Extension'"
echo "   4. Select this directory: $(pwd)"
echo ""
echo "Alternative manual link:"
echo "   ln -s $(pwd) ~/.config/zed/extensions/auto-docs"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Happy coding!"
echo ""
