#!/usr/bin/env python3
"""
Count TypeScript 'any' usage across the codebase.

Usage:
    python count_any_usage.py [--path PATH] [--detailed]

Examples:
    python count_any_usage.py
    python count_any_usage.py --path app/
    python count_any_usage.py --detailed
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

def count_any_in_file(filepath):
    """Count 'any' occurrences in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match 'any' as a word boundary (not part of "company", etc.)
        # Common patterns: ': any', '<any>', 'any[]', 'any,', 'any)'
        pattern = r'\bany\b'
        matches = re.findall(pattern, content)

        # Filter out comments
        lines = content.split('\n')
        count = 0
        details = []

        for i, line in enumerate(lines, 1):
            # Skip line comments and JSDoc comments
            if '//' in line or line.strip().startswith('*'):
                continue
            if 'any' in line:
                any_matches = re.findall(pattern, line)
                if any_matches:
                    count += len(any_matches)
                    details.append((i, line.strip()))

        return count, details
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        return 0, []

def find_ts_files(root_path):
    """Find all TypeScript files, excluding node_modules, .next, etc."""
    exclude_dirs = {'node_modules', '.next', 'dist', 'build', '.git', 'prisma'}
    ts_files = []

    for root, dirs, files in os.walk(root_path):
        # Remove excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            if file.endswith(('.ts', '.tsx')):
                ts_files.append(os.path.join(root, file))

    return ts_files

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Count TypeScript "any" usage')
    parser.add_argument('--path', default='.', help='Root path to search')
    parser.add_argument('--detailed', action='store_true', help='Show line-by-line details')
    args = parser.parse_args()

    root_path = Path(args.path).resolve()
    if not root_path.exists():
        print(f"Error: Path {root_path} does not exist", file=sys.stderr)
        return 1

    print(f"🔍 Analyzing TypeScript files in: {root_path}\n")

    files = find_ts_files(root_path)
    total_any = 0
    file_counts = []

    for filepath in files:
        count, details = count_any_in_file(filepath)
        if count > 0:
            rel_path = os.path.relpath(filepath, root_path)
            file_counts.append((rel_path, count, details))
            total_any += count

    # Sort by count (descending)
    file_counts.sort(key=lambda x: x[1], reverse=True)

    # Print summary
    print("📊 Files with 'any' usage (sorted by count):\n")
    print(f"{'File':<60} {'Count':>6}")
    print("-" * 68)

    for filepath, count, details in file_counts[:20]:  # Top 20
        print(f"{filepath:<60} {count:>6}")

        if args.detailed and count > 0:
            print(f"\n  Details for {filepath}:")
            for line_num, line_content in details[:5]:  # Show first 5
                print(f"    Line {line_num}: {line_content[:80]}")
            if len(details) > 5:
                print(f"    ... and {len(details) - 5} more")
            print()

    if len(file_counts) > 20:
        print(f"\n... and {len(file_counts) - 20} more files")

    # Print totals
    print("\n" + "=" * 68)
    print(f"📈 TOTAL 'any' occurrences: {total_any}")
    print(f"📁 Files with 'any': {len(file_counts)}")
    print(f"📂 Total TypeScript files: {len(files)}")

    if total_any > 0:
        print(f"\n💡 Average 'any' per affected file: {total_any / len(file_counts):.1f}")

    return 0

if __name__ == '__main__':
    sys.exit(main())
