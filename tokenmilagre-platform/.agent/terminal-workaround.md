---
description: Workaround for terminal output not showing in Antigravity IDE
---

# Terminal Output Bug Workaround

When the Antigravity IDE terminal is not showing command output (known issue with recent Fedora versions), use this workaround:

## Problem
- Commands run successfully (exit code 0)
- But stdout/stderr are empty in the IDE terminal
- Background commands show "RUNNING" but no output

## Solution
Instead of running commands directly, redirect output to a temporary file:

```bash
# Instead of:
git status

# Use:
git status > /tmp/output.txt 2>&1
```

Then read the file using view_file tool:
```
view_file /tmp/output.txt
```

Or in one command:
```bash
git status > temp_output.txt 2>&1 && cat temp_output.txt
```

## Cleanup
After reading, delete the temporary file:
```bash
rm temp_output.txt
```

## Trigger Phrase
When this happens, user can say:
- "Terminal bug: redirect to file workaround"
- "O terminal não mostra output, use o workaround de arquivo"
