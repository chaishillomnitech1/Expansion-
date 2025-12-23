# Milestone Tracking Workflow

## Quick Start Guide

This workflow automatically tracks changes to milestone files and maintains a comprehensive status log.

### Tracked Files
- `TRACKING_LEDGERS/FINAL_ACQUISITIONS_PHASE8.md`
- `TRACKING_LEDGERS/CONSTRUCTION_MILESTONES.md`

### Automatic Operation

The workflow runs automatically when you:
1. Commit changes to either tracking file
2. Push to `main` or any `copilot/**` branch
3. Manually trigger via GitHub Actions UI

### What Happens Automatically

1. **On Push**: Workflow detects changes to tracking files
2. **Metadata Extraction**: Captures commit author, message, and timestamp
3. **Status Parsing**: Counts milestones by status (COMPLETED, IN PROGRESS, PLANNED, PENDING/SECURED)
4. **Log Update**: Updates `TRACKING_LEDGERS/STATUS.log` with current counts and change history
5. **Enhanced Commit**: Pushes updated log with full metadata

### Example Workflow Run

```
Trigger: Update CONSTRUCTION_MILESTONES.md
  ↓
Extract: Author="Jane Doe", Message="Complete milestone CM-001", Time="2025-11-13T20:30:00Z"
  ↓
Parse: COMPLETED=1, IN_PROGRESS=1, PLANNED=3, PENDING_SECURED=3
  ↓
Update: STATUS.log with new counts and history entry
  ↓
Commit: "chore: Update milestone status tracking
         Automated update triggered by: Jane Doe
         Original commit: Complete milestone CM-001
         Timestamp: 2025-11-13T20:30:00Z"
```

### Manual Trigger

You can also manually trigger the workflow:
1. Go to Actions tab in GitHub
2. Select "Milestone Status Tracker"
3. Click "Run workflow"
4. Select branch and click "Run workflow"

### Viewing Results

Check `TRACKING_LEDGERS/STATUS.log` to see:
- Current milestone counts
- Recent change history (last 10 entries)
- Tracking file status
- Last update information

### File Format Requirements

Tracking files should use markdown tables with a "Status" column:

```markdown
| Milestone ID | Project Name | Status      |
|--------------|-------------|-------------|
| CM-001       | Task One    | COMPLETED   |
| CM-002       | Task Two    | IN PROGRESS |
```

Recognized status values:
- `COMPLETED`
- `IN PROGRESS`
- `PLANNED`
- `PENDING/SECURED`

(Status matching is case-insensitive)

### Troubleshooting

**Workflow not triggering?**
- Ensure you're pushing to `main` or a `copilot/**` branch
- Verify you modified one of the tracked files
- Check GitHub Actions tab for any errors

**STATUS.log not updating?**
- Check workflow run logs in GitHub Actions
- Verify Python script has execute permissions
- Ensure tracking files use proper markdown table format

**Need to update manually?**
```bash
cd /path/to/repo
python3 .github/scripts/update_milestone_status.py "Manual update"
```

### Advanced Configuration

To modify which files are tracked, edit `.github/workflows/milestone_tracker.yml`:

```yaml
on:
  push:
    paths:
      - 'TRACKING_LEDGERS/YOUR_FILE.md'  # Add your file here
```

To add new status categories, edit `.github/scripts/update_milestone_status.py`:

```python
status_counts = {
    "YOUR_STATUS": len(re.findall(r'YOUR_STATUS', content, re.IGNORECASE)),
    # ... existing statuses
}
```

## Support

For issues or questions:
1. Check the workflow run logs in GitHub Actions
2. Review `TRACKING_LEDGERS/README.md` for detailed documentation
3. Examine `STATUS.log` for current system state
