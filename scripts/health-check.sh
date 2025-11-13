#!/bin/bash
# Omnitech1 Health Check Script
# Author: Chais Hill
# Purpose: Monitor system health and provide diagnostics

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "======================================"
echo "  Omnitech1 Health Check"
echo "======================================"
echo ""

# Check repository health
echo -e "${GREEN}[1/5]${NC} Repository Health Check"
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "  ✓ Git repository initialized"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "  ✓ Current branch: $BRANCH"
    COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
    echo "  ✓ Total commits: $COMMIT_COUNT"
else
    echo "  ✗ Not a git repository"
fi
echo ""

# Check workflow files
echo -e "${GREEN}[2/5]${NC} Workflow Configuration Check"
if [ -d ".github/workflows" ]; then
    WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | wc -l)
    echo "  ✓ Workflows directory exists"
    echo "  ✓ Total workflow files: $WORKFLOW_COUNT"
    
    # List workflows
    find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null | while read -r file; do
        echo "    - $(basename "$file")"
    done
else
    echo "  ✗ No workflows directory found"
fi
echo ""

# Check documentation
echo -e "${GREEN}[3/5]${NC} Documentation Check"
if [ -f "README.md" ]; then
    README_SIZE=$(wc -c < README.md)
    echo "  ✓ README.md exists (${README_SIZE} bytes)"
else
    echo "  ✗ No README.md found"
fi

if [ -f "LICENSE" ]; then
    echo "  ✓ LICENSE file exists"
else
    echo "  ⚠ No LICENSE file found"
fi
echo ""

# Check scripts directory
echo -e "${GREEN}[4/5]${NC} Scripts Directory Check"
if [ -d "scripts" ]; then
    SCRIPT_COUNT=$(find scripts -type f -name "*.sh" 2>/dev/null | wc -l)
    echo "  ✓ Scripts directory exists"
    echo "  ✓ Total scripts: $SCRIPT_COUNT"
else
    echo "  ⚠ No scripts directory found"
fi
echo ""

# Check security
echo -e "${GREEN}[5/5]${NC} Security Check"
# Check for sensitive files
SENSITIVE_PATTERNS=(".env" "*.key" "*.pem" "*secret*" "*password*")
FOUND_SENSITIVE=false

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if find . -name "$pattern" -not -path "./.git/*" 2>/dev/null | grep -q .; then
        echo "  ⚠ Warning: Found files matching pattern: $pattern"
        FOUND_SENSITIVE=true
    fi
done

if [ "$FOUND_SENSITIVE" = false ]; then
    echo "  ✓ No obvious sensitive files found in repository"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    echo "  ✓ .gitignore file exists"
else
    echo "  ⚠ No .gitignore file found"
fi
echo ""

echo "======================================"
echo -e "${GREEN}Health Check Complete${NC}"
echo "======================================"
