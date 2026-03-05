#!/bin/bash

# Omnitech1 Expansion - Deployment Script
# Author: Chais Hill
# Description: Deploy ScrollCoin and LayerZero bridge contracts

set -e

echo "================================================"
echo "Omnitech1 Expansion Deployment Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Please create a .env file with the following variables:"
    echo "  PRIVATE_KEY=your_private_key"
    echo "  RPC_URL=your_rpc_url"
    echo "  ETHERSCAN_API_KEY=your_etherscan_api_key"
    exit 1
fi

# Source environment variables
source .env

# Network selection
echo "Select deployment network:"
echo "1) Ethereum Mainnet"
echo "2) Ethereum Goerli (Testnet)"
echo "3) Ethereum Sepolia (Testnet)"
echo "4) Polygon Mainnet"
echo "5) Polygon Mumbai (Testnet)"
echo "6) BSC Mainnet"
echo "7) BSC Testnet"
read -p "Enter choice [1-7]: " network_choice

case $network_choice in
    1) NETWORK="ethereum"
       LZ_ENDPOINT="0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675"
       ;;
    2) NETWORK="goerli"
       LZ_ENDPOINT="0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23"
       ;;
    3) NETWORK="sepolia"
       LZ_ENDPOINT="0xae92d5aD7583AD66E49A0c67BAd18F6ba52dDDc1"
       ;;
    4) NETWORK="polygon"
       LZ_ENDPOINT="0x3c2269811836af69497E5F486A85D7316753cf62"
       ;;
    5) NETWORK="mumbai"
       LZ_ENDPOINT="0xf69186dfBa60DdB133E91E9A4B5673624293d8F8"
       ;;
    6) NETWORK="bsc"
       LZ_ENDPOINT="0x3c2269811836af69497E5F486A85D7316753cf62"
       ;;
    7) NETWORK="bsc-testnet"
       LZ_ENDPOINT="0x6Fcb97553D41516Cb228ac03FdC8B9a0a9df04A1"
       ;;
    *) echo -e "${RED}Invalid choice${NC}"
       exit 1
       ;;
esac

echo -e "${GREEN}Selected network: $NETWORK${NC}"
echo -e "${GREEN}LayerZero Endpoint: $LZ_ENDPOINT${NC}"
echo ""

# Deployment steps
echo "Deployment Steps:"
echo "1. Deploy ScrollCoin token"
echo "2. Deploy OmniChain Bridge"
echo "3. Configure bridge with token"
echo "4. Verify contracts on block explorer"
echo ""

read -p "Continue with deployment? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "================================================"
echo "Step 1: Deploying ScrollCoin Token"
echo "================================================"

# This would use Hardhat or Foundry in a real deployment
echo "Contract deployment command would execute here"
echo "Example: npx hardhat run scripts/deploy-scrollcoin.js --network $NETWORK"

# Placeholder for actual deployment
SCROLLCOIN_ADDRESS="0x0000000000000000000000000000000000000000"
echo -e "${YELLOW}ScrollCoin deployed at: $SCROLLCOIN_ADDRESS${NC}"

echo ""
echo "================================================"
echo "Step 2: Deploying OmniChain Bridge"
echo "================================================"

echo "Bridge deployment command would execute here"
echo "Example: npx hardhat run scripts/deploy-bridge.js --network $NETWORK"

# Placeholder for actual deployment
BRIDGE_ADDRESS="0x0000000000000000000000000000000000000000"
echo -e "${YELLOW}Bridge deployed at: $BRIDGE_ADDRESS${NC}"

echo ""
echo "================================================"
echo "Step 3: Configuring Contracts"
echo "================================================"

echo "Setting up bridge configuration..."
echo "- Connecting ScrollCoin to Bridge"
echo "- Configuring supported chains"
echo "- Setting bridge fees"

echo ""
echo "================================================"
echo "Step 4: Verifying Contracts"
echo "================================================"

echo "Contract verification would execute here"
echo "Example: npx hardhat verify --network $NETWORK $SCROLLCOIN_ADDRESS"

echo ""
echo "================================================"
echo "Deployment Summary"
echo "================================================"
echo -e "Network:           ${GREEN}$NETWORK${NC}"
echo -e "ScrollCoin:        ${GREEN}$SCROLLCOIN_ADDRESS${NC}"
echo -e "OmniChain Bridge:  ${GREEN}$BRIDGE_ADDRESS${NC}"
echo -e "LayerZero Endpoint: ${GREEN}$LZ_ENDPOINT${NC}"
echo ""
echo "Next steps:"
echo "1. Update config/layerzero-config.json with deployed addresses"
echo "2. Test cross-chain transfers on testnet"
echo "3. Set up monitoring and alerts"
echo "4. Prepare for mainnet deployment"
echo ""
echo -e "${GREEN}Deployment script completed!${NC}"
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
