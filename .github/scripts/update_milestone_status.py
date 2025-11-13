#!/usr/bin/env python3
"""
Milestone Tracker Script
Parses milestone tracking files and updates STATUS.log with changes
"""

import os
import sys
import re
from datetime import datetime, timezone
from pathlib import Path

TRACKING_DIR = Path(os.getenv("TRACKING_DIR", "TRACKING_LEDGERS"))
STATUS_LOG = TRACKING_DIR / "STATUS.log"
TRACKING_FILES = [
    "FINAL_ACQUISITIONS_PHASE8.md",
    "CONSTRUCTION_MILESTONES.md"
]


def parse_milestone_file(filepath):
    """Parse a milestone tracking file and extract status counts."""
    if not filepath.exists():
        return {}
    
    content = filepath.read_text()
    
    # Count different statuses
    status_counts = {
        "PENDING/SECURED": len(re.findall(r'PENDING/SECURED', content, re.IGNORECASE)),
        "IN PROGRESS": len(re.findall(r'IN PROGRESS', content, re.IGNORECASE)),
        "PLANNED": len(re.findall(r'PLANNED', content, re.IGNORECASE)),
        "COMPLETED": len(re.findall(r'COMPLETED', content, re.IGNORECASE)),
    }
    
    # Count total milestone rows (lines with |)
    lines = [line for line in content.split('\n') if line.strip().startswith('|')]
    # Exclude header and separator rows
    milestone_lines = [line for line in lines if not re.match(r'^\|[\s\-:]+\|', line)]
    
    return {
        "status_counts": status_counts,
        "total": len(milestone_lines) - 1 if milestone_lines else 0  # -1 for header
    }


def update_status_log(changed_files, commit_message, author, timestamp):
    """Update the STATUS.log file with current milestone status."""
    
    # Parse all tracking files
    total_milestones = 0
    status_summary = {
        "PENDING/SECURED": 0,
        "IN PROGRESS": 0,
        "PLANNED": 0,
        "COMPLETED": 0
    }
    
    for filename in TRACKING_FILES:
        filepath = TRACKING_DIR / filename
        if filepath.exists():
            data = parse_milestone_file(filepath)
            total_milestones += data.get("total", 0)
            for status, count in data.get("status_counts", {}).items():
                status_summary[status] += count
    
    # Generate log content
    log_lines = [
        "=== MILESTONE TRACKING STATUS LOG ===",
        f"Last Updated: {timestamp}",
        f"Updated By: {author}",
        "",
        "--- TRACKING FILES ---"
    ]
    
    for filename in TRACKING_FILES:
        filepath = TRACKING_DIR / filename
        if filepath.exists():
            log_lines.append(f"- {filename} (exists)")
        else:
            log_lines.append(f"- {filename} (not found)")
    
    log_lines.extend([
        "",
        "--- STATUS SUMMARY ---",
        f"Total Milestones Tracked: {total_milestones}",
        f"Completed: {status_summary['COMPLETED']}",
        f"In Progress: {status_summary['IN PROGRESS']}",
        f"Planned: {status_summary['PLANNED']}",
        f"Pending/Secured: {status_summary['PENDING/SECURED']}",
        "",
        "--- RECENT CHANGES ---"
    ])
    
    # Add recent change entry
    change_entry = f"[{timestamp}] {author}: {commit_message}"
    if changed_files:
        change_entry += f" (Files: {', '.join(changed_files)})"
    log_lines.append(change_entry)
    
    # Append existing history if STATUS.log exists
    if STATUS_LOG.exists():
        existing_content = STATUS_LOG.read_text()
        # Extract change history from existing log
        if "--- RECENT CHANGES ---" in existing_content or "--- CHANGE HISTORY ---" in existing_content:
            history_marker = "--- RECENT CHANGES ---" if "--- RECENT CHANGES ---" in existing_content else "--- CHANGE HISTORY ---"
            history_section = existing_content.split(history_marker)[1].strip()
            # Keep last 10 entries
            history_lines = [line for line in history_section.split('\n') if line.strip()]
            for line in history_lines[:9]:  # Keep 9 old + 1 new = 10 total
                if line not in log_lines:
                    log_lines.append(line)
    
    # Write updated log
    log_content = '\n'.join(log_lines) + '\n'
    STATUS_LOG.write_text(log_content)
    
    print(f"✓ STATUS.log updated successfully")
    print(f"  Total milestones: {total_milestones}")
    print(f"  Completed: {status_summary['COMPLETED']}")
    print(f"  In Progress: {status_summary['IN PROGRESS']}")


def main():
    """Main entry point."""
    # Get commit information from environment or arguments
    commit_message = os.getenv("COMMIT_MESSAGE", sys.argv[1] if len(sys.argv) > 1 else "Manual update")
    author = os.getenv("COMMIT_AUTHOR", os.getenv("GITHUB_ACTOR", "system"))
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Get changed files
    changed_files_str = os.getenv("CHANGED_FILES", "")
    changed_files = [f.strip() for f in changed_files_str.split(',') if f.strip()]
    
    # Filter for tracking files
    tracking_changes = [f for f in changed_files if any(tf in f for tf in TRACKING_FILES)]
    
    if not tracking_changes:
        print("ℹ No milestone tracking files changed, updating status anyway...")
    
    # Update the status log
    update_status_log(tracking_changes, commit_message, author, timestamp)
    
    print("✓ Milestone tracking update complete")


if __name__ == "__main__":
    main()
