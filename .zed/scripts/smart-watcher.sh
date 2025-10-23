#!/bin/bash

# Cooldown period in seconds
COOLDOWN_PERIOD=15

# Excluded directories
EXCLUDED_DIRS=("node_modules" ".git" "vendor" "build" "dist" ".docs")

# Function to check if a directory is excluded
is_excluded() {
    local dir="$1"
    for exclude in "${EXCLUDED_DIRS[@]}"; do
        if [[ "$dir" == *"$exclude"* ]]; then
            return 0
        fi
    done
    return 1
}

# Function to get changed files
get_changed_files() {
    git diff --name-only HEAD | grep -Ev "$(IFS='|'; echo "${EXCLUDED_DIRS[*]}")"
}

# Function to process changes
process_changes() {
    while true; do
        local CHANGED_FILES_LIST=$(get_changed_files)
        if [ -n "$CHANGED_FILES_LIST" ]; then
            export CHANGED_FILES_LIST
            echo -e "\e[32mChanged files:\e[0m \$CHANGED_FILES_LIST"
        fi
        sleep $COOLDOWN_PERIOD
    done
}

# Check if fswatch or inotifywait is available
if command -v fswatch &> /dev/null; then
    fswatch -o . | while read; do
        process_changes
    done
elif command -v inotifywait &> /dev/null; then
    while inotifywait -r -e modify .; do
        process_changes
    done
else
    echo -e "\e[33mNo fswatch or inotifywait found, using git fallback.\e[0m"
    process_changes
fi
