# 🎮 Zed Auto-Docs

**Automatic documentation generation for your code in Zed Editor**

This Zed extension automatically analyzes your code and generates documentation as you work. It uses a 15-second cooldown system to batch changes and creates AI-powered prompts for Zed's Assistant.

---

## ✨ Features

- 🔍 **Smart File Watching** - Monitors file saves with 15-second cooldown
- 📝 **Auto Documentation** - Generates README.md in each component folder
- 🤖 **AI Prompt Generation** - Creates prompts for Zed Assistant in `.docs/prompts/`
- 📊 **Progress Tracking** - Maintains a progress tracker in `.docs/PROGRESS.md`
- 🎨 **Tailwind Detection** - Extracts and documents Tailwind CSS classes
- 🌐 **Multi-Language** - Supports JS, TS, JSX, TSX, Python, Go, Rust, Java, Svelte

---

## 🚀 Installation

### Prerequisites
- [Zed Editor](https://zed.dev) installed
- [Bun](https://bun.sh) runtime installed
- Git

### Step 1: Clone & Build

```bash
git clone https://github.com/gageracer/zed-auto-docs.git
cd zed-auto-docs
./setup.sh
```

### Step 2: Install in Zed

**Option A: Dev Extension (Recommended for testing)**
1. Open Zed
2. Press `cmd-shift-x` (or `ctrl-shift-x` on Linux)
3. Click "Install Dev Extension"
4. Select the `zed-auto-docs` directory

**Option B: Manual Link**
```bash
ln -s $(pwd) ~/.config/zed/extensions/auto-docs
```

---

## 📖 How It Works

### Automatic Mode
1. **Save a file** - Extension tracks the change
2. **15-second cooldown** - Batches multiple saves together
3. **Analysis runs** - Extracts functions, classes, imports, Tailwind classes
4. **Generates docs** - Creates/updates README.md in the file's directory
5. **Creates AI prompt** - Saves prompt in `.docs/prompts/[filename].prompt.md`

### Enhanced with Zed Assistant
1. Check `.docs/prompts/` for generated prompts
2. Open a prompt file in Zed
3. Press `cmd-'` to open Zed Assistant
4. The prompt is pre-filled with your code analysis
5. Get comprehensive AI-generated documentation
6. Copy the response into your component's README.md

---

## 🎯 Supported File Types

| Language | Extensions |
|----------|------------|
| JavaScript | `.js`, `.jsx` |
| TypeScript | `.ts`, `.tsx` |
| Python | `.py` |
| Go | `.go` |
| Rust | `.rs` |
| Java | `.java` |
| Svelte | `.svelte` |

---

## 📁 Generated Files

```
your-project/
├── .docs/
│   ├── PROGRESS.md          # Overall progress tracker
│   └── prompts/
│       ├── Component.svelte.prompt.md
│       ├── utils.ts.prompt.md
│       └── ...
├── src/
│   ├── components/
│   │   ├── Component.svelte
│   │   └── README.md        # Auto-generated docs
│   └── utils/
│       ├── helper.ts
│       └── README.md        # Auto-generated docs
```

---

## ⚙️ Configuration

### Cooldown Period
Default: 15 seconds

To change, edit `src/extension.ts`:
```typescript
private readonly COOLDOWN_MS = 15000; // milliseconds
```

### Excluded Directories
By default, these directories are ignored:
- `node_modules`
- `.git`
- `vendor`
- `build`
- `dist`
- `.docs`

---

## 💡 Usage Tips

### Basic Workflow
1. Code normally in Zed
2. Save your files (`cmd-s`)
3. Extension automatically documents them
4. Check `.docs/PROGRESS.md` for overview

### Advanced Workflow (with AI)
1. Save your file
2. Open `.docs/prompts/[your-file].prompt.md`
3. Use Zed Assistant (`cmd-'`) with the prompt
4. Get detailed AI-generated documentation
5. Customize and add to your README

### Manual Trigger
Just save any supported file to trigger documentation update.

---

## 📊 What Gets Analyzed

- ✅ **Functions** - All function declarations and expressions
- ✅ **Classes** - Class definitions and exports
- ✅ **Imports** - Dependencies and module imports
- ✅ **Tailwind Classes** - All `className` attributes
- ✅ **File Structure** - Lines of code, complexity estimates

---

## 🐛 Troubleshooting

### Extension not activating?
- Check Zed's extension logs: View → Extensions → Show Logs
- Ensure Bun is installed: `bun --version`
- Rebuild: `cd zed-auto-docs && bun run build`

### Documentation not generating?
- Verify file type is supported
- Check cooldown period hasn't been exceeded
- Look for errors in Zed's console

### Prompts not appearing?
- Ensure `.docs/prompts/` directory exists
- Check file permissions
- Try saving the file again

---

## 🛠️ Development

### Build
```bash
bun run build
```

### Watch Mode
```bash
bun run dev
```

### Project Structure
```
zed-auto-docs/
├── extension.toml      # Zed extension config
├── package.json        # Bun dependencies
├── setup.sh           # Installation script
├── src/
│   └── extension.ts   # Main extension code
└── README.md          # This file
```

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📜 License

MIT License - feel free to use in your projects!

---

## 🎉 Credits

Built for the Zed Editor community by [@gageracer](https://github.com/gageracer)

---

## 🔗 Links

- [Zed Editor](https://zed.dev)
- [Bun Runtime](https://bun.sh)
- [Report Issues](https://github.com/gageracer/zed-auto-docs/issues)

---

**Happy Coding! 🚀**
