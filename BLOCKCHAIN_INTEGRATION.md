# Blockchain Integration for Expansion-

## Overview

This repository now includes a complete blockchain infrastructure implementing philanthropic mechanisms for:

1. **Shield of Honor™ Initiative** - Automated charitable token with transparent fund management
2. **OmniGambling NFT Marketplace** - NFT marketplace with integrated donation systems

## Quick Start

### Prerequisites

- Node.js v22.10.0 or later (LTS version)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Compile smart contracts
npm run compile

# Run tests
npm test
```

## Project Structure

```
Expansion-/
├── contracts/                          # Smart contracts
│   ├── HonorCoin.sol                  # ERC-20 token with 7.77% fee
│   ├── ShieldOfHonorTreasury.sol      # Treasury management
│   ├── HonorNFTStaking.sol            # NFT staking & governance
│   ├── OmniGamblingMarketplace.sol    # NFT marketplace with donations
│   ├── HonorAuditNFT.sol              # Audit trail NFTs
│   └── TestNFT.sol                    # Test NFT for development
│
├── test/                               # Test suites
│   ├── HonorCoin.test.js
│   ├── ShieldOfHonorTreasury.test.js
│   └── OmniGamblingMarketplace.test.js
│
├── scripts/                            # Deployment scripts
│   └── deploy.js                      # Main deployment script
│
├── docs/                               # Documentation
│   ├── BLOCKCHAIN_README.md           # Complete technical overview
│   └── DEPLOYMENT_GUIDE.md            # Deployment instructions
│
├── .github/workflows/                  # CI/CD
│   └── test-contracts.yml             # Automated testing
│
├── hardhat.config.js                   # Hardhat configuration
└── package.json                        # Project dependencies
```

## Key Components

### 1. HonorCoin (ERC-20 Token)

The philanthropic token that powers both initiatives:

- **Automatic Fee**: 7.77% of every transfer goes to the treasury
- **Transparent**: All fees tracked on-chain
- **Flexible**: Configurable exemptions for contracts

```solidity
// Example: Transfer with automatic fee
honorCoin.transfer(recipient, amount);
// 7.77% automatically sent to treasury
```

### 2. Shield of Honor™ Treasury

Manages the ethical support fund:

- **Milestone-Based**: Funds released when milestones are reached
- **Automated**: Chainlink Automation triggers disbursements
- **Transparent**: Complete audit trail via events and NFTs
- **Secure**: Role-based access control

```solidity
// Create a milestone
treasury.createMilestone(
    "Community Support Program",
    targetAmount,      // e.g., 10,000 HONOR
    disbursementAmount, // e.g., 8,000 HONOR
    beneficiaryAddress
);

// Chainlink Automation automatically completes when target reached
```

### 3. NFT Staking & Governance

Rewards NFT holders with governance rights:

- **Stake NFTs**: Earn HonorCoin rewards
- **Vote**: Participate in governance decisions
- **Transparent**: Voting power based on stake duration

```solidity
// Stake an NFT
staking.stakeNFT(tokenId);

// Vote on proposals
staking.vote(proposalId, true); // true = support
```

### 4. OmniGambling NFT Marketplace

NFT marketplace with charitable integration:

- **Trade NFTs**: Buy and sell with HonorCoin
- **Donate**: Optional donations on purchases
- **Track**: All donations recorded as NFTs
- **Support**: Multiple charitable causes

```solidity
// Purchase with donation
marketplace.purchaseNFT(
    nftContract,
    tokenId,
    donationAmount, // Optional donation
    causeId        // Which cause to support
);
```

## Integration Features

### For Shield of Honor™ Initiative

✅ **Automated Philanthropic Tokens (HonorCoin)**
- 7.77% fee on all transactions automatically allocated to ethical support fund
- Transparent fee tracking with total fees collected metric

✅ **Staking Mechanisms**
- NFT holders can stake to earn rewards
- Staked NFTs grant governance voting rights in the Intergalactic DAO
- Minimum 7-day stake period for voting eligibility

✅ **Transparency through NFT-Based Audit Trail**
- Every disbursement recorded as an NFT
- Backers can view fund utilization on-chain
- Permanent, immutable records

✅ **Chainlink Oracle Integration**
- Automated milestone-triggered disbursements
- `checkUpkeep` monitors milestone status
- `performUpkeep` executes disbursements automatically

### For OmniGambling NFT Marketplace

✅ **Tokenized Donations**
- Users can channel portions of gambling rewards to charitable causes
- Optional donation on every NFT purchase
- Direct donation mechanism available

✅ **NFT-Based Donation Tracking**
- Each donation creates an NFT record
- Fractional shared assets as stakeholder rewards
- Complete donation history per user

✅ **Staking and Endowment Models**
- Users can stake assets for sustained charitable support
- Reward distribution to stakers
- Long-term funding sustainability

✅ **Global Accessibility & Compliance**
- Multi-jurisdictional philanthropic standards supported
- Transparent operations for regulatory compliance
- Flexible configuration for regional requirements

## Smart Contract Addresses

After deployment, contract addresses will be saved in `deployment-addresses.json`:

```json
{
  "network": "sepolia",
  "chainId": "11155111",
  "contracts": {
    "HonorCoin": "0x...",
    "Treasury": "0x...",
    "AuditNFT": "0x...",
    "Marketplace": "0x...",
    "Staking": "0x..."
  }
}
```

## Testing

Comprehensive test suite with 45+ test cases:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npx hardhat test test/HonorCoin.test.js
```

## Deployment

### Local Development

```bash
# Start local Hardhat network
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Deploy to Mumbai testnet (Polygon)
npx hardhat run scripts/deploy.js --network mumbai
```

### Mainnet Deployment

1. Update `hardhat.config.js` with mainnet RPC URLs
2. Ensure sufficient ETH/MATIC for gas fees
3. Run deployment script with mainnet network
4. Verify contracts on Etherscan/Polygonscan

See [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## Security Features

- ✅ **Access Control**: Role-based permissions (Admin, Manager, Auditor)
- ✅ **Reentrancy Protection**: All sensitive functions protected
- ✅ **Input Validation**: Comprehensive checks on all inputs
- ✅ **Safe Math**: Solidity 0.8.x overflow protection
- ✅ **Audit Trail**: All actions logged with events
- ✅ **Fee Limits**: Maximum fee caps to prevent abuse

## Workflow Integration

### GitHub Actions

Automated testing runs on every push:

- Compiles all contracts
- Runs complete test suite
- Generates coverage reports
- Security checks (when available)

## Next Steps

1. **Deploy to Testnet**: Test contracts in a live environment
2. **Set Up Chainlink Automation**: Register upkeeps for automated disbursements
3. **Create Charitable Causes**: Add causes to the marketplace
4. **Define Milestones**: Set up initial treasury milestones
5. **Frontend Development**: Build dApp for user interaction
6. **Security Audit**: Professional audit before mainnet deployment

## Support & Documentation

- **Technical Overview**: [docs/BLOCKCHAIN_README.md](docs/BLOCKCHAIN_README.md)
- **Deployment Guide**: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
- **Smart Contract Code**: [contracts/](contracts/)
- **Test Examples**: [test/](test/)

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Submit a pull request

---

**Built for the Shield of Honor™ Initiative and OmniGambling NFT Marketplace**

Implementing blockchain-driven philanthropic mechanisms with transparency, automation, and global accessibility.
