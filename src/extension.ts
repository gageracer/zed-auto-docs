// Zed Auto-Docs Extension - Full Implementation
// Automatically generates documentation for your code with AI

import * as fs from 'fs';
import * as path from 'path';

interface FileChange {
  path: string;
  timestamp: number;
}

class AutoDocsExtension {
  private changedFiles: Map<string, FileChange> = new Map();
  private cooldownTimer: NodeJS.Timeout | null = null;
  private readonly COOLDOWN_MS = 15000;
  private readonly SUPPORTED_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.svelte'];
  private docsDir = '.docs';
  private promptsDir = '.docs/prompts';

  async activate() {
    console.log('🎮 Auto-Docs extension activated');
    await this.initializeDocs();
  }

  deactivate() {
    console.log('👋 Auto-Docs extension deactivated');
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
    }
  }

  private async initializeDocs() {
    if (!fs.existsSync(this.docsDir)) {
      fs.mkdirSync(this.docsDir, { recursive: true });
    }
    if (!fs.existsSync(this.promptsDir)) {
      fs.mkdirSync(this.promptsDir, { recursive: true });
    }
    const progressPath = path.join(this.docsDir, 'PROGRESS.md');
    if (!fs.existsSync(progressPath)) {
      await this.createProgressTracker();
    }
  }

  async onFileSaved(filePath: string) {
    const ext = path.extname(filePath);
    if (!this.SUPPORTED_EXTENSIONS.includes(ext)) {
      return;
    }
    if (this.isExcluded(filePath)) {
      return;
    }
    console.log(`📍 Tracked change: ${filePath}`);
    this.changedFiles.set(filePath, {
      path: filePath,
      timestamp: Date.now()
    });
    this.scheduleCooldown();
  }

  private isExcluded(filePath: string): boolean {
    const excluded = ['node_modules', '.git', 'vendor', 'build', 'dist', '.docs'];
    return excluded.some(dir => filePath.includes(dir));
  }

  private scheduleCooldown() {
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
    }
    const fileCount = this.changedFiles.size;
    console.log(`⏳ Changes queued: ${fileCount}`);
    this.cooldownTimer = setTimeout(() => {
      this.processChanges();
    }, this.COOLDOWN_MS);
  }

  private async processChanges() {
    if (this.changedFiles.size === 0) {
      return;
    }
    console.log(`🔄 Processing ${this.changedFiles.size} file(s)...`);
    for (const [filePath] of this.changedFiles) {
      await this.analyzeFile(filePath);
    }
    this.changedFiles.clear();
    await this.updateProgressTracker();
    console.log('✅ Documentation updated!');
  }

  private async analyzeFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const ext = path.extname(filePath);
      const dir = path.dirname(filePath);
      const filename = path.basename(filePath);
      const analysis = this.performBasicAnalysis(content, ext, filename);
      await this.createAIPrompt(filePath, content, ext);
      await this.updateComponentReadme(dir, filename, analysis);
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error);
    }
  }

  private performBasicAnalysis(content: string, ext: string, filename: string) {
    const lines = content.split('\n');
    const totalLines = lines.length;
    const functions = this.extractFunctions(content, ext);
    const classes = this.extractClasses(content, ext);
    const imports = this.extractImports(content, ext);
    const tailwindClasses = this.extractTailwind(content);
    const completion = totalLines > 50 ? 70 : 40;
    return { filename, totalLines, functions, classes, imports, tailwindClasses, completion };
  }

  private extractFunctions(content: string, ext: string): string[] {
    const patterns: Record<string, RegExp> = {
      '.js': /^\s*(function|const|let|var)\s+\w+\s*=\s*.*\(|^\s*async\s+\w+\s*\(/gm,
      '.ts': /^\s*(function|const|let|var)\s+\w+\s*=\s*.*\(|^\s*async\s+\w+\s*\(/gm,
      '.jsx': /^\s*(function|const|let|var)\s+\w+\s*=\s*.*\(|^\s*async\s+\w+\s*\(/gm,
      '.tsx': /^\s*(function|const|let|var)\s+\w+\s*=\s*.*\(|^\s*async\s+\w+\s*\(/gm,
      '.svelte': /^\s*(function|const|let|var)\s+\w+\s*=\s*.*\(|^\s*async\s+\w+\s*\(/gm,
      '.py': /^\s*def\s+\w+\s*\(/gm,
      '.go': /^func\s+\w+\s*\(/gm,
      '.rs': /^\s*fn\s+\w+\s*\(/gm,
      '.java': /^\s*(public|private|protected)?\s*(static)?\s*\w+\s+\w+\s*\(/gm
    };
    const pattern = patterns[ext];
    if (!pattern) return [];
    const matches = content.match(pattern) || [];
    return matches.slice(0, 10).map(m => m.trim());
  }

  private extractClasses(content: string, ext: string): string[] {
    const patterns: Record<string, RegExp> = {
      '.js': /^\s*(class|export class)\s+\w+/gm,
      '.ts': /^\s*(class|export class)\s+\w+/gm,
      '.jsx': /^\s*(class|export class)\s+\w+/gm,
      '.tsx': /^\s*(class|export class)\s+\w+/gm,
      '.py': /^\s*class\s+\w+/gm,
      '.rs': /^\s*struct\s+\w+/gm,
      '.java': /^\s*(public|private)?\s*class\s+\w+/gm
    };
    const pattern = patterns[ext];
    if (!pattern) return [];
    const matches = content.match(pattern) || [];
    return matches.slice(0, 5).map(m => m.trim());
  }

  private extractImports(content: string, ext: string): string[] {
    const patterns: Record<string, RegExp> = {
      '.js': /^import\s+.+/gm,
      '.ts': /^import\s+.+/gm,
      '.jsx': /^import\s+.+/gm,
      '.tsx': /^import\s+.+/gm,
      '.svelte': /^import\s+.+/gm,
      '.py': /^(import|from)\s+.+/gm,
      '.go': /^\s*".+"/gm,
      '.rs': /^use\s+.+/gm,
      '.java': /^import\s+.+/gm
    };
    const pattern = patterns[ext];
    if (!pattern) return [];
    const matches = content.match(pattern) || [];
    return matches.slice(0, 10).map(m => m.trim());
  }

  private extractTailwind(content: string): string[] {
    const pattern = /class(Name)?="([^"]*)"/g;
    const matches: string[] = [];
    let match;
    while ((match = pattern.exec(content)) !== null) {
      matches.push(match[0]);
      if (matches.length >= 5) break;
    }
    return matches;
  }

  private async createAIPrompt(filePath: string, content: string, ext: string) {
    const filename = path.basename(filePath);
    const fileType = this.getFileType(ext);
    const prompt = `# Documentation Request for: ${filePath}\n\n**File Type:** ${fileType}\n**Last Modified:** ${new Date().toISOString()}\n\n## Task\nPlease analyze this ${fileType} file and create comprehensive documentation.\n\n## Code to Analyze\n\`\`\`${ext.slice(1)}\n${content}\n\`\`\`\n\n## Required Documentation Structure\n\n### 1. Purpose\nWhat does this file/component do?\n\n### 2. Key Elements\n- Main functions/classes/components\n- Important variables or state\n- Key logic flows\n\n### 3. Dependencies\n- Imports and external dependencies\n- Internal module dependencies\n\n### 4. Tailwind/Styling (if applicable)\n- Key Tailwind classes used\n- Styling patterns\n\n### 5. Status & Completeness\n- Estimated completion: X%\n- What's implemented\n- What might be missing\n\n### 6. TODO & Suggestions\n- [ ] Suggested improvements\n- [ ] Missing tests\n- [ ] Potential bugs or edge cases\n- [ ] Performance optimizations\n\n---\n*Generated by Zed Auto-Docs*`;
    const promptPath = path.join(this.promptsDir, `${filename}.prompt.md`);
    fs.writeFileSync(promptPath, prompt, 'utf-8');
    console.log(`📝 Created prompt: ${promptPath}`);
  }

  private getFileType(ext: string): string {
    const types: Record<string, string> = {
      '.svelte': 'Svelte component',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript (React)',
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript (React)',
      '.py': 'Python',
      '.go': 'Go',
      '.rs': 'Rust',
      '.java': 'Java'
    };
    return types[ext] || 'code';
  }

  private async updateComponentReadme(dir: string, filename: string, analysis: any) {
    const readmePath = path.join(dir, 'README.md');
    const componentName = path.basename(dir);
    const docContent = `# ${componentName}\n\n## 📄 File: \`${filename}\`\n\n### Purpose\n${this.getFileType(path.extname(filename))} - ${analysis.totalLines > 100 ? 'Complex implementation' : 'Standard implementation'}\n\n### 🔧 Key Components\n\n${analysis.functions.length > 0 ? `#### Functions\n\`\`\`\n${analysis.functions.join('\n')}\n\`\`\`\n` : ''}${analysis.classes.length > 0 ? `#### Classes\n\`\`\`\n${analysis.classes.join('\n')}\n\`\`\`\n` : ''}### 📦 Dependencies\n\n${analysis.imports.length > 0 ? `\`\`\`\n${analysis.imports.join('\n')}\n\`\`\`\n` : ''}${analysis.tailwindClasses.length > 0 ? `### 🎨 Styling\nUses Tailwind CSS:\n\`\`\`\n${analysis.tailwindClasses.join('\n')}\n\`\`\`\n` : ''}### 📊 Status\n- **Lines of Code:** ${analysis.totalLines}\n- **Estimated Completion:** ${analysis.completion}%\n- **Last Modified:** ${new Date().toISOString().split('T')[0]}\n\n### ✅ Next Steps\n- [ ] Add comprehensive documentation\n- [ ] Add unit tests\n- [ ] Code review\n- [ ] Performance optimization\n\n---\n*Auto-generated by Zed Auto-Docs | For better docs, use Zed Assistant with prompt in \
`.docs/prompts/`*\n`;
    if (fs.existsSync(readmePath)) {
      let existing = fs.readFileSync(readmePath, 'utf-8');
      if (existing.includes('## 🤖 Auto-Generated Insights')) {
        existing = existing.split('## 🤖 Auto-Generated Insights')[0];
      }
      fs.writeFileSync(readmePath, existing + '\n---\n## 🤖 Auto-Generated Insights\n*Updated: ' + new Date().toLocaleString() + '*\n\n' + docContent, 'utf-8');
    } else {
      fs.writeFileSync(readmePath, docContent, 'utf-8');
    }
    console.log(`✅ Updated: ${readmePath}`);
  }

  private async createProgressTracker() {
    const content = `# 🎮 Coding Progress Tracker\n\n## 📊 Project Overview\n*Auto-generated documentation tracker*\n\n---\n\n## ✅ Completion Checklist\n\n### Components Documented\n- [ ] Initial setup\n\n### Files Analysis\n*No files analyzed yet*\n\n### Suggestions\n*Waiting for code analysis...*\n\n---\n*Last Updated: ${new Date().toLocaleString()}*`;
    const progressPath = path.join(this.docsDir, 'PROGRESS.md');
    fs.writeFileSync(progressPath, content, 'utf-8');
  }

  private async updateProgressTracker() {
    const findReadmes = (dir: string): string[] => {
      const results: string[] = [];
      if (!fs.existsSync(dir)) return results;
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        if (this.isExcluded(fullPath)) continue;
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          results.push(...findReadmes(fullPath));
        } else if (item === 'README.md' && !fullPath.includes('.docs')) {
          results.push(fullPath);
        }
      }
      return results;
    };
    const readmes = findReadmes(process.cwd());
    const documented = readmes.length;
    const content = `# 🎮 Coding Progress Tracker\n\n**Last Updated:** ${new Date().toLocaleString()}  \n**Components Documented:** ${documented}  \n\n---\n\n## ✅ Documented Components\n\n${readmes.map(r => `- ✅ **${path.basename(path.dirname(r))}** - [\`${r}\`](${r})`).join('\n')}\n\n---\n\n## 🎯 Workflow\n\n### Automatic (Basic Docs)\nThe extension creates basic documentation automatically with a 15-second cooldown.\n\n### Enhanced with Zed Assistant\nFor better documentation:\n1. Check \
`.docs/prompts/` for generated prompts\n2. Open a prompt file in Zed\n3. Use Zed Assistant (cmd-') to generate comprehensive docs\n4. Copy the response into the component's README.md\n\n### Manual Trigger\n- Save any supported file to trigger documentation update\n\n---\n*💡 Tip: Use Zed's Assistant (cmd-') with the generated prompts for AI-powered documentation*`;
    const progressPath = path.join(this.docsDir, 'PROGRESS.md');
    fs.writeFileSync(progressPath, content, 'utf-8');
  }
}

export default new AutoDocsExtension();
