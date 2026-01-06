#!/bin/bash
mkdir -p .agent/workflows

# Find all agent files in workers/
find .agent/workers -name "*-agent.md" | while read -r file; do
    filename=$(basename "$file")
    # Calculate relative path from .agent/workflows to the file
    # file is like .agent/workers/meta/ROUTER-agent.md
    # target link is .agent/workflows/ROUTER-agent.md
    # relative path: ../workers/meta/ROUTER-agent.md (approx)
    
    # Using realpath to be safe if available, or just hardcoded depth
    # Since we are in root, and link is in .agent/workflows...
    # .agent/workflows is 2 levels deep? No, .agent (1) / workflows (2).
    # .agent/workers/meta is 3 levels deep.
    
    # Let's use absolute paths for the link target to be safer locally, or relative if we want portability.
    # Relative is better.
    # From .agent/processes, ../workers/Category/File
    
    # Actually, simpler: just link to the known path from root.
    # ln -s ../../$file .agent/workflows/$filename
    # Wait, $file is .agent/workers/...
    # ../../.agent/workers/... -> root/workers/... (Wrong)
    
    # From .agent/workflows:
    # ../workers/CATEGORY/FILE
    
    category=$(basename $(dirname "$file"))
    ln -sf "../workers/$category/$filename" ".agent/workflows/$filename"
    echo "Linked $filename -> workers/$category/$filename"
done
