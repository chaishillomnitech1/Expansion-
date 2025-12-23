#!/bin/bash
# Omnitech1 Monitoring and Diagnostics Script
# Author: Chais Hill
# Purpose: Collect metrics and provide system diagnostics

set -e

# Output directory for logs
LOG_DIR="logs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="${LOG_DIR}/diagnostics_${TIMESTAMP}.log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Start logging
exec > >(tee -a "$LOG_FILE") 2>&1

echo "======================================"
echo "  Omnitech1 Diagnostics Report"
echo "  Generated: $(date)"
echo "======================================"
echo ""

# System Information
echo "[System Information]"
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Working Directory: $(pwd)"
echo "Shell: $SHELL"
echo ""

# Git Repository Metrics
echo "[Git Repository Metrics]"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Repository: $(basename "$(git rev-parse --show-toplevel)")"
    echo "Current Branch: $(git rev-parse --abbrev-ref HEAD)"
    echo "Last Commit: $(git log -1 --format='%h - %s (%cr)' 2>/dev/null || echo 'No commits')"
    echo "Total Commits: $(git rev-list --count HEAD 2>/dev/null || echo '0')"
    echo "Total Branches: $(git branch -a | wc -l)"
    echo "Total Tags: $(git tag | wc -l)"
    echo "Repository Size: $(du -sh .git 2>/dev/null | cut -f1 || echo 'Unknown')"
else
    echo "Not a git repository"
fi
echo ""

# Workflow Statistics
echo "[Workflow Statistics]"
if [ -d ".github/workflows" ]; then
    TOTAL_WORKFLOWS=$(find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | wc -l)
    echo "Total Workflows: $TOTAL_WORKFLOWS"
    echo ""
    echo "Workflow Files:"
    find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | while read -r workflow; do
        LINES=$(wc -l < "$workflow")
        echo "  - $(basename "$workflow"): ${LINES} lines"
    done
else
    echo "No workflows directory found"
fi
echo ""

# File Statistics
echo "[File Statistics]"
echo "Total Files: $(find . -type f -not -path "./.git/*" 2>/dev/null | wc -l)"
echo "Total Directories: $(find . -type d -not -path "./.git/*" 2>/dev/null | wc -l)"
echo ""
echo "File Types:"
for ext in yml yaml sh md json js ts py; do
    COUNT=$(find . -name "*.$ext" -not -path "./.git/*" 2>/dev/null | wc -l)
    if [ "$COUNT" -gt 0 ]; then
        echo "  - .$ext files: $COUNT"
    fi
done
echo ""

# Security Check
echo "[Security Analysis]"
echo "Checking for potential security issues..."

# Check for exposed secrets patterns
SECRET_PATTERNS=("password" "secret" "api_key" "token" "private_key")
FINDINGS=0

for pattern in "${SECRET_PATTERNS[@]}"; do
    MATCHES=$(grep -r -i "$pattern" --include="*.yml" --include="*.yaml" --include="*.sh" \
              --exclude-dir=".git" --exclude-dir="logs" . 2>/dev/null | wc -l)
    if [ "$MATCHES" -gt 0 ]; then
        echo "  ⚠ Found $MATCHES occurrences of '$pattern' - verify these are properly secured"
        FINDINGS=$((FINDINGS + MATCHES))
    fi
done

if [ "$FINDINGS" -eq 0 ]; then
    echo "  ✓ No obvious security concerns found"
fi
echo ""

# Performance Metrics
echo "[Performance Metrics]"
if [ -d ".github/workflows" ]; then
    echo "Average Workflow Size: $(find .github/workflows -name "*.yml" -o -name "*.yaml" -exec wc -l {} \; | \
          awk '{sum+=$1; count++} END {if(count>0) print int(sum/count); else print 0}') lines"
fi
echo ""

# Recommendations
echo "[Recommendations]"
ISSUES=0

# Check for README
if [ ! -f "README.md" ]; then
    echo "  ⚠ Consider adding a README.md file"
    ISSUES=$((ISSUES + 1))
fi

# Check for .gitignore
if [ ! -f ".gitignore" ]; then
    echo "  ⚠ Consider adding a .gitignore file"
    ISSUES=$((ISSUES + 1))
fi

# Check for documentation
if [ ! -d "docs" ] && [ ! -d "documentation" ]; then
    echo "  ⚠ Consider adding a documentation directory"
    ISSUES=$((ISSUES + 1))
fi

# Check for tests
if [ ! -d "tests" ] && [ ! -d "test" ]; then
    echo "  ℹ Consider adding a tests directory"
fi

if [ "$ISSUES" -eq 0 ]; then
    echo "  ✓ No critical issues found"
fi
echo ""

echo "======================================"
echo "Diagnostics Complete"
echo "Report saved to: $LOG_FILE"
echo "======================================"
