#!/bin/bash

REPO_PATH="C:/Users/nsvir/Documents/thebigmini"
LOG_FILE="$REPO_PATH/merge_log.txt"

echo "==============================" >> "$LOG_FILE"
echo "Run at: $(date)" >> "$LOG_FILE"

cd "$REPO_PATH" || { echo "ERROR: Could not find repo at $REPO_PATH" >> "$LOG_FILE"; exit 1; }

# Fetch latest
git fetch origin >> "$LOG_FILE" 2>&1

# Switch to main and pull latest
git checkout main >> "$LOG_FILE" 2>&1
git pull origin main >> "$LOG_FILE" 2>&1

# Merge develop into main
git merge develop --no-edit >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "ERROR: Merge failed. Resolve conflicts manually." >> "$LOG_FILE"
  exit 1
fi

# Push to remote
git push origin main >> "$LOG_FILE" 2>&1

if [ $? -ne 0 ]; then
  echo "ERROR: Push failed." >> "$LOG_FILE"
  exit 1
fi

echo "SUCCESS: develop merged into main and pushed." >> "$LOG_FILE"
