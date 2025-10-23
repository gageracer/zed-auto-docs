# Zed Auto-Docs 📝

Automatic documentation system for Zed editor that monitors your code changes and generates component READMEs with progress tracking.

## Features

- 🔄 **Smart File Watcher** - Monitors changes with 15-second cooldown
- 🎯 **Scope-Aware** - Only analyzes changed source files
- 📚 **Auto-Documentation** - Generates component READMEs using GitHub Copilot
- ✅ **Progress Tracking** - Maintains a central checklist of your work
- 🪝 **Git Integration** - Automatically updates docs on commit
- 🚀 **Zero Friction** - You code, it documents

## Quick Start

```bash
# Clone into your project
git clone https://github.com/gageracer/zed-auto-docs.git
cd zed-auto-docs

# Run setup
./setup.sh

# Start the smart watcher
./.zed/scripts/smart-watcher.sh
```

## How It Works

1. **Smart Watcher** monitors your code files
2. When you make changes, it waits 15 seconds (cooldown)
3. Only changed files are analyzed
4. GitHub Copilot generates documentation
5. Component READMEs and progress tracker update automatically
6. Git commits also trigger documentation updates

## Usage

### Option 1: Background Watcher (Recommended)
```bash
# Start in background
nohup ./.zed/scripts/smart-watcher.sh > .docs/watcher.log 2>&1 &
```

### Option 2: Manual Trigger in Zed
- Press `cmd-shift-p` (macOS) or `ctrl-shift-p` (Linux/Windows)
- Type "Tasks: Spawn"
- Select "Update Documentation"

### Option 3: Automatic on Git Commit
Documentation updates automatically after each commit via git hook.

## Configuration

### Supported File Types
- JavaScript (`.js`)
- TypeScript (`.ts`)
- Python (`.py`)
- Go (`.go`)
- Rust (`.rs`)
- Java (`.java`)

### Cooldown Period
Default: 15 seconds. Edit in `.zed/scripts/smart-watcher.sh`:
```bash
COOLDOWN=15  # Change this value
```

### Excluded Directories
- `node_modules/`
- `.git/`
- `vendor/`
- `build/`
- `dist/`

## Requirements

- Zed Editor
- Bash
- Git
- GitHub CLI with Copilot (optional, but recommended)

### Install GitHub Copilot CLI
```bash
gh extension install github/gh-copilot
```

## Documentation Output

### Component READMEs
Each component folder gets a `README.md` with:
- Purpose and description
- Key functions/classes
- Dependencies
- Status and completion estimate
- TODO suggestions

### Progress Tracker
`.docs/PROGRESS.md` shows:
- Overall completion percentage
- Documented vs undocumented components
- Suggested next steps
- Last update timestamp

## Stop the Watcher

```bash
# Find the process
ps aux | grep smart-watcher

# Kill it
kill <PID>
```

## License

MIT
