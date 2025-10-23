use zed_extension_api::{self as zed, SlashCommand, SlashCommandOutput, SlashCommandOutputSection};
use std::fs;
use std::path::Path;

struct AutoDocsExtension;

impl zed::Extension for AutoDocsExtension {
    fn new() -> Self {
        AutoDocsExtension
    }

    fn run_slash_command(
        &self,
        command: SlashCommand,
        args: Vec<String>,
        worktree: Option<&zed::Worktree>,
    ) -> Result<SlashCommandOutput, String> {
        match command.name.as_str() {
            "document" => {
                if args.is_empty() {
                    return Err("Please provide a filename, e.g., /document GameHeader.svelte".into());
                }

                let filename = args[0].clone();
                let worktree_path = worktree
                    .and_then(|w| w.root_path())
                    .ok_or("No workspace open")?;

                let file_path = Path::new(&worktree_path).join(&filename);

                if !file_path.exists() {
                    return Err(format!("File not found: {}", filename));
                }

                let content = fs::read_to_string(&file_path)
                    .map_err(|e| format!("Failed to read file: {}", e))?;

                let ext = file_path
                    .extension()
                    .and_then(|e| e.to_str())
                    .unwrap_or("txt");

                let file_type = match ext {
                    "svelte" => "Svelte component",
                    "ts" => "TypeScript",
                    "tsx" => "TypeScript (React)",
                    "js" => "JavaScript",
                    "jsx" => "JavaScript (React)",
                    "py" => "Python",
                    "rs" => "Rust",
                    "go" => "Go",
                    "java" => "Java",
                    _ => "code file",
                };

                let prompt = format!(
                    "# Documentation Request for: {}\n\n\
                    **File Type:** {}\n\n\
                    ## Task\n\
                    Please analyze this {} and create comprehensive documentation including:\n\n\
                    1. **Purpose & Overview** - What does this file do?\n\
                    2. **Key Components** - Main functions, classes, or components\n\
                    3. **Props/Parameters** - If applicable (for components/functions)\n\
                    4. **Dependencies** - Important imports and their usage\n\
                    5. **Usage Examples** - How to use this in your project\n\
                    6. **State Management** - If applicable (for components)\n\
                    7. **Styling** - If Tailwind or CSS classes are used\n\n\
                    ## Code to Document\n\n\
                    ```{}\n\
                    {}\n\
                    ```\n\n\
                    Please generate clear, well-structured Markdown documentation.",
                    filename,
                    file_type,
                    file_type,
                    ext,
                    content
                );

                Ok(SlashCommandOutput {
                    sections: vec![SlashCommandOutputSection {
                        range: (0..prompt.len()).into(),
                        label: format!("📝 Documentation for {}", filename),
                    }],
                    text: prompt,
                })
            }
            _ => Err(format!("Unknown command: {}", command.name)),
        }
    }

    fn complete_slash_command_argument(
        &self,
        command: SlashCommand,
        _args: Vec<String>,
    ) -> Result<Vec<zed::SlashCommandArgumentCompletion>, String> {
        if command.name == "document" {
            Ok(vec![])
        } else {
            Ok(vec![])
        }
    }
}

zed::register_extension!(AutoDocsExtension);
