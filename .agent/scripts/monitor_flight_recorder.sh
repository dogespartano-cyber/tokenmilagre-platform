#!/bin/bash
# Flight Recorder Monitor
# Usage: ./monitor_flight_recorder.sh

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Go up one level to .agent
AGENT_DIR="$(dirname "$SCRIPT_DIR")"
LOG_FILE="$AGENT_DIR/logs/flight_recorder.log"

echo "📡 flight_recorder_v1.1 initialized..."
echo "📂 Watching: $LOG_FILE"
echo "---------------------------------------------------"

# Check if file exists
if [ ! -f "$LOG_FILE" ]; then
    echo "⚠️ Log file not found. Creating..."
    # Ensure dir exists
    mkdir -p "$(dirname "$LOG_FILE")"
    touch "$LOG_FILE"
fi

# Tail the log in real-time
tail -f "$LOG_FILE"
