# 🎮 Zed Auto-Docs

Automatic documentation generation for your code using Zed's built-in AI assistant.

## ✨ Features

- 🤖 **Uses Zed's Native AI** - Works with whatever AI model you have configured (GPT-4, Claude, etc.)
- 💰 **No API Costs** - Uses your existing Zed AI subscription
- 🔧 **Simple Slash Command** - Just type `/document filename` in Zed Assistant
- 📝 **Smart Prompts** - Analyzes your code and creates comprehensive documentation requests
- 🎯 **Multi-Language** - Supports TypeScript, JavaScript, Svelte, Python, Rust, Go, Java, and more

---

## 🚀 Installation

### Prerequisites

1. **Rust** (for building the extension):
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Zed Editor** with AI configured:
   - Make sure you have Zed's AI assistant set up
   - Configure your preferred model in Zed settings

### Install Extension

```bash
# Clone the repository
git clone https://github.com/gageracer/zed-auto-docs.git
cd zed-auto-docs

# Build the extension
./build.sh

# Install in Zed
# 1. Open Zed
# 2. Press cmd-shift-x (Extensions)
# 3. Click "Install Dev Extension"
# 4. Select the zed-auto-docs directory
```

---

## 📖 Usage

### Step 1: Open Zed Assistant
Press `cmd-'` to open the Assistant panel

### Step 2: Use the `/document` command
```
/document src/components/GameHeader.svelte
```

### Step 3: AI Generates Documentation
Zed's AI (using your configured model) will:
- Read your file
- Analyze the code structure
- Generate comprehensive documentation

### Step 4: Save the Documentation
Copy the AI-generated documentation to your component's README.md

---

## 🎯 Example

**Input:**
```
/document src/lib/components/game/GameHeader.svelte
```

**AI Output:**
```markdown
# GameHeader Component

## Purpose & Overview
A Svelte component that displays the game header with score tracking...

## Key Components
- `isPaused`: Boolean state for pause functionality
- `formatTime`: Utility function for time display
...

## Usage Example
```svelte
<script>
  import GameHeader from './GameHeader.svelte';
</script>

<GameHeader />
```
```

---

## 🛠️ Development

### Build from Source
```bash
cargo build --target wasm32-wasip1 --release
```

### Project Structure
```
zed-auto-docs/
├── extension.toml      # Extension metadata
├── Cargo.toml         # Rust dependencies
├── src/
│   └── lib.rs        # Main extension code
└── build.sh          # Build helper script
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open issues for bugs or feature requests
- Submit pull requests
- Improve documentation

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🔗 Links

- **Repository:** https://github.com/gageracer/zed-auto-docs
- **Zed Editor:** https://zed.dev
- **Extension API Docs:** https://zed.dev/docs/extensions

---

## 💡 Tips

- Use relative paths from your project root: `/document src/components/Button.tsx`
- The extension works with any AI model configured in Zed
- Generated documentation can be edited and customized as needed
- Works great with Tailwind CSS projects - detects styling patterns

---

**Built with ❤️ for the Zed community**