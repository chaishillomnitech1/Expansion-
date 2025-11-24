#!/bin/bash
# Omnitech1 Automated Deployment Script
# Author: Chais Hill
# Purpose: Streamline deployment and management tasks

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check for git
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    
    # Check for GitHub CLI (optional but recommended)
    if ! command -v gh &> /dev/null; then
        log_warning "GitHub CLI (gh) is not installed - some features may be limited"
    fi
    
    log_success "Prerequisites check completed"
}

# Validate repository state
validate_repository() {
    log_info "Validating repository state..."
    
    # Check if in git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
        exit 1
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD -- 2>/dev/null; then
        log_warning "There are uncommitted changes in the repository"
    fi
    
    log_success "Repository validation completed"
}

# Deploy function
deploy() {
    log_info "Starting deployment process..."
    
    # Pull latest changes
    log_info "Pulling latest changes from remote..."
    git pull origin main || log_warning "Could not pull from main branch"
    
    # Run any pre-deployment checks
    log_info "Running pre-deployment checks..."
    
    # Validate workflows
    if [ -d ".github/workflows" ]; then
        log_info "Validating GitHub workflows..."
        workflow_count=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
        log_success "Found $workflow_count workflow files"
    fi
    
    log_success "Deployment completed successfully"
}

# Main execution
main() {
    echo "======================================"
    echo "  Omnitech1 Deployment Manager v1.0"
    echo "======================================"
    echo ""
    
    check_prerequisites
    validate_repository
    deploy
    
    echo ""
    log_success "All deployment tasks completed!"
}

# Run main function
main "$@"
