#!/usr/bin/env python3
"""
Analyze component complexity by measuring file sizes and identifying large components.

Usage:
    python analyze_complexity.py [--path PATH] [--threshold LINES]

Examples:
    python analyze_complexity.py
    python analyze_complexity.py --path app/
    python analyze_complexity.py --threshold 300
"""

import os
import sys
from pathlib import Path

def count_lines(filepath):
    """Count lines in a file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return sum(1 for _ in f)
    except Exception as e:
        print(f"Error reading {filepath}: {e}", file=sys.stderr)
        return 0

def analyze_file_complexity(filepath, threshold=500):
    """Analyze a single file for complexity metrics."""
    lines = count_lines(filepath)

    # Simple heuristics for complexity
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Count hooks (rough estimate of state complexity)
    hooks_count = content.count('useState') + content.count('useEffect') + \
                  content.count('useCallback') + content.count('useMemo') + \
                  content.count('useRef')

    # Count functions
    functions_count = content.count('function ') + content.count('const ') + \
                      content.count('=> {')

    return {
        'lines': lines,
        'hooks': hooks_count,
        'functions': functions_count,
        'is_complex': lines > threshold
    }

def find_ts_files(root_path):
    """Find all TypeScript files."""
    exclude_dirs = {'node_modules', '.next', 'dist', 'build', '.git'}
    ts_files = []

    for root, dirs, files in os.walk(root_path):
        dirs[:] = [d for d in dirs if d not in exclude_dirs]

        for file in files:
            if file.endswith(('.ts', '.tsx')):
                ts_files.append(os.path.join(root, file))

    return ts_files

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Analyze component complexity')
    parser.add_argument('--path', default='.', help='Root path to search')
    parser.add_argument('--threshold', type=int, default=500,
                        help='Line threshold for complexity warning')
    args = parser.parse_args()

    root_path = Path(args.path).resolve()
    if not root_path.exists():
        print(f"Error: Path {root_path} does not exist", file=sys.stderr)
        return 1

    print(f"🔍 Analyzing component complexity in: {root_path}")
    print(f"⚠️  Threshold: {args.threshold} lines\n")

    files = find_ts_files(root_path)
    file_metrics = []

    for filepath in files:
        metrics = analyze_file_complexity(filepath, args.threshold)
        rel_path = os.path.relpath(filepath, root_path)
        file_metrics.append((rel_path, metrics))

    # Sort by line count (descending)
    file_metrics.sort(key=lambda x: x[1]['lines'], reverse=True)

    # Find complex files
    complex_files = [(f, m) for f, m in file_metrics if m['is_complex']]

    # Print top 20 largest files
    print("📊 Largest components (Top 20):\n")
    print(f"{'File':<60} {'Lines':>6} {'Hooks':>6} {'Funcs':>6}")
    print("-" * 80)

    for filepath, metrics in file_metrics[:20]:
        status = "🔴" if metrics['is_complex'] else "🟢"
        print(f"{status} {filepath:<57} {metrics['lines']:>6} {metrics['hooks']:>6} {metrics['functions']:>6}")

    # Summary
    print("\n" + "=" * 80)
    print(f"📈 TOTAL files analyzed: {len(files)}")
    print(f"🔴 Complex files (>{args.threshold} lines): {len(complex_files)}")

    if len(complex_files) > 0:
        avg_complex_size = sum(m['lines'] for _, m in complex_files) / len(complex_files)
        print(f"📏 Average size of complex files: {avg_complex_size:.0f} lines")

        print(f"\n💡 Refactoring Recommendations:")
        print(f"   • Break components into smaller, focused modules")
        print(f"   • Extract custom hooks for complex state logic")
        print(f"   • Consider creating _components/ subdirectories")
        print(f"   • Target: All files < {args.threshold} lines")

    return 0

if __name__ == '__main__':
    sys.exit(main())
