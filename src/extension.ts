// Zed Auto-Docs Extension
// Automatically generates documentation for your code

interface ZedExtension {
  activate(): void;
  deactivate(): void;
}

class AutoDocsExtension implements ZedExtension {
  private fileWatcher: any;
  private cooldownTimer: NodeJS.Timeout | null = null;
  private changedFiles: Set<string> = new Set();
  private readonly COOLDOWN_MS = 15000;

  activate() {
    console.log("Auto-Docs extension activated");
    this.startFileWatcher();
  }

  deactivate() {
    console.log("Auto-Docs extension deactivated");
    if (this.fileWatcher) {
      this.fileWatcher.close();
    }
  }

  private startFileWatcher() {
    console.log("Starting file watcher...");
  }
}

export default new AutoDocsExtension();