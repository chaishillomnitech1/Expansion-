# Milestone Tracking System

## Overview
This directory contains the automated milestone tracking infrastructure that monitors changes to milestone tracking files and maintains a comprehensive status log.

## Components

### Tracking Files
- **FINAL_ACQUISITIONS_PHASE8.md** - Tracks final acquisition phase milestones
- **CONSTRUCTION_MILESTONES.md** - Tracks construction project milestones

### Automated Status Log
- **STATUS.log** - Automatically updated log containing:
  - Current milestone counts by status
  - Change history with timestamps and authors
  - Summary of tracking file states

## How It Works

### GitHub Actions Workflow
The `milestone_tracker.yml` workflow automatically:
1. Triggers on commits that modify tracking files
2. Extracts commit metadata (author, message, timestamp)
3. Parses both tracking files for milestone statuses
4. Updates `STATUS.log` with current counts and change history
5. Commits the updated log with enhanced metadata

### Status Categories
The system tracks milestones in the following categories:
- **COMPLETED** - Finished milestones
- **IN PROGRESS** - Currently active work
- **PLANNED** - Future milestones
- **PENDING/SECURED** - Acquisitions in pending/secured state

### Commit Message Enhancement
When the workflow commits STATUS.log updates, it includes:
- Original commit author
- Original commit message
- Timestamp of the change
- List of changed files

## Manual Updates

You can manually update the STATUS.log by running:

```bash
cd /home/runner/work/Expansion-/Expansion-
python3 .github/scripts/update_milestone_status.py "Your commit message"
```

Or with environment variables:

```bash
CHANGED_FILES="TRACKING_LEDGERS/CONSTRUCTION_MILESTONES.md" \
COMMIT_MESSAGE="Complete milestone XYZ" \
COMMIT_AUTHOR="Your Name" \
python3 .github/scripts/update_milestone_status.py
```

## File Format

Tracking files should use markdown tables with a "Status" column. Example:

```markdown
| Milestone ID | Project Name | Status      |
|--------------|-------------|-------------|
| CM-001       | Task One    | COMPLETED   |
| CM-002       | Task Two    | IN PROGRESS |
```

The system recognizes these status values (case-insensitive):
- COMPLETED
- IN PROGRESS
- PLANNED
- PENDING/SECURED

## Viewing History

The STATUS.log maintains a rolling history of the last 10 changes, showing:
- Timestamp (ISO 8601 format)
- Author who made the change
- Commit message
- Files that were modified
