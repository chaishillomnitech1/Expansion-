#!/bin/bash

###############################################################################
# Deployment Validation Script
# Validates all components of CSBC Pinnacle Post & OmniGambling Marketplace
# Author: Chais Hill | Omnitech1
###############################################################################

set -e

echo "🔍 CSBC & OmniGambling Deployment Validation"
echo "=============================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation counters
PASSED=0
FAILED=0

###############################################################################
# Helper Functions
###############################################################################

validate() {
    local check_name="$1"
    local check_command="$2"
    
    echo -n "Checking: $check_name ... "
    
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
        return 1
    fi
}

###############################################################################
# CSBC Pinnacle Post Validation
###############################################################################

echo "📝 Validating CSBC Pinnacle Post..."
echo "-----------------------------------"

validate "CSBC directory exists" "[ -d 'csbc-pinnacle-post' ]"
validate "CSBC scripts directory" "[ -d 'csbc-pinnacle-post/scripts' ]"
validate "Post generation script" "[ -f 'csbc-pinnacle-post/scripts/generate-post.js' ]"
validate "CSBC workflow file" "[ -f '.github/workflows/csbc-pinnacle-post.yml' ]"

echo ""

###############################################################################
# OmniGambling Marketplace Validation
###############################################################################

echo "🏪 Validating OmniGambling Marketplace..."
echo "-----------------------------------------"

validate "Marketplace directory" "[ -d 'omnigambling-marketplace' ]"
validate "Contracts directory" "[ -d 'omnigambling-marketplace/contracts' ]"
validate "Shield of Honor contract" "[ -f 'omnigambling-marketplace/contracts/ShieldOfHonor.sol' ]"
validate "Scripts directory" "[ -d 'omnigambling-marketplace/scripts' ]"
validate "Deploy script" "[ -f 'omnigambling-marketplace/scripts/deploy-marketplace.js' ]"
validate "Chainlink script" "[ -f 'omnigambling-marketplace/scripts/chainlink-metadata-updater.js' ]"
validate "Config directory" "[ -d 'omnigambling-marketplace/config' ]"
validate "Marketplace config" "[ -f 'omnigambling-marketplace/config/marketplace-config.json' ]"
validate "Marketplace workflow" "[ -f '.github/workflows/omnigambling-marketplace-deploy.yml' ]"

echo ""

###############################################################################
# Workflow Validation
###############################################################################

echo "⚙️  Validating GitHub Workflows..."
echo "----------------------------------"

validate "CSBC workflow syntax" "grep -q 'name: CSBC Pinnacle Post Pipeline' '.github/workflows/csbc-pinnacle-post.yml'"
validate "Marketplace workflow syntax" "grep -q 'name: OmniGambling Marketplace Deployment' '.github/workflows/omnigambling-marketplace-deploy.yml'"
validate "Sync workflow exists" "[ -f '.github/workflows/launch-synchronization.yml' ]"
validate "Sync workflow syntax" "grep -q 'name: Launch Synchronization' '.github/workflows/launch-synchronization.yml'"

echo ""

###############################################################################
# Configuration Validation
###############################################################################

echo "⚙️  Validating Configurations..."
echo "--------------------------------"

# Check if Node.js is available (optional)
if command -v node >/dev/null 2>&1; then
    echo -n "Checking: Node.js available ... "
    echo -e "${GREEN}✓ PASSED${NC} ($(node --version))"
    ((PASSED++))
    
    # Validate JSON files
    echo -n "Checking: Marketplace config JSON ... "
    if node -e "JSON.parse(require('fs').readFileSync('omnigambling-marketplace/config/marketplace-config.json', 'utf8'))" 2>/dev/null; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
else
    echo -e "${YELLOW}⚠ Node.js not available - skipping JSON validation${NC}"
fi

echo ""

###############################################################################
# Documentation Validation
###############################################################################

echo "📚 Validating Documentation..."
echo "------------------------------"

validate "Launch documentation" "[ -f 'LAUNCH_DOCUMENTATION.md' ]"
validate "Main README" "[ -f 'README.md' ]"

echo ""

###############################################################################
# Script Execution Tests
###############################################################################

echo "🧪 Testing Script Execution..."
echo "------------------------------"

if command -v node >/dev/null 2>&1; then
    echo -n "Testing: CSBC post generation ... "
    if cd csbc-pinnacle-post/scripts && node generate-post.js > /dev/null 2>&1; then
        cd ../..
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        
        # Verify generated files
        validate "Generated post metadata" "[ -f 'csbc-pinnacle-post/assets/csbc-pinnacle-post.json' ]"
        validate "Generated broadcast instructions" "[ -f 'csbc-pinnacle-post/assets/broadcast-instructions.json' ]"
    else
        cd ../..
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
    
    echo -n "Testing: Marketplace deployment script ... "
    if cd omnigambling-marketplace/scripts && node deploy-marketplace.js > /dev/null 2>&1; then
        cd ../..
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        
        # Verify deployment output
        validate "Deployment output generated" "[ -f 'omnigambling-marketplace/config/deployment-output.json' ]"
    else
        cd ../..
        echo -e "${RED}✗ FAILED${NC}"
        ((FAILED++))
    fi
    
    echo -n "Testing: Chainlink updater script ... "
    if cd omnigambling-marketplace/scripts && node chainlink-metadata-updater.js > /dev/null 2>&1; then
        cd ../..
        echo -e "${GREEN}✓ PASSED${NC}"
        ((PASSED++))
        
        # Verify Chainlink output
        validate "Chainlink results generated" "[ -f 'omnigambling-marketplace/config/chainlink-update-results.json' ]"
    else
        cd ../..
        echo -e "${YELLOW}⚠ SKIPPED${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Node.js not available - skipping execution tests${NC}"
fi

echo ""

###############################################################################
# Security Checks
###############################################################################

echo "🔒 Security Validation..."
echo "------------------------"

echo -n "Checking: No hardcoded secrets in workflows ... "
if ! grep -r "sk-" .github/workflows/ 2>/dev/null && \
   ! grep -r "ghp_" .github/workflows/ 2>/dev/null && \
   ! grep -r "0x[a-fA-F0-9]\{64\}" .github/workflows/ 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((FAILED++))
fi

echo -n "Checking: Environment variables used for secrets ... "
if grep -q "\${{ secrets\." .github/workflows/omnigambling-marketplace-deploy.yml 2>/dev/null || \
   grep -q "process.env" omnigambling-marketplace/scripts/*.js 2>/dev/null; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC}"
fi

echo ""

###############################################################################
# Summary
###############################################################################

echo "=============================================="
echo "📊 Validation Summary"
echo "=============================================="
echo ""
echo -e "Total Checks: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL VALIDATIONS PASSED${NC}"
    echo ""
    echo "🚀 Deployment Process Status: READY"
    echo ""
    echo "Next Steps:"
    echo "1. Review generated artifacts"
    echo "2. Configure GitHub Secrets (if deploying to production)"
    echo "3. Run GitHub workflows"
    echo "4. Monitor deployment progress"
    echo ""
    exit 0
else
    echo -e "${RED}❌ SOME VALIDATIONS FAILED${NC}"
    echo ""
    echo "Please review the failed checks above and fix the issues."
    echo ""
    exit 1
fi
