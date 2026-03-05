# Blockchain-Driven Philanthropic Mechanisms

## Overview

This repository implements blockchain-driven philanthropic mechanisms for two major initiatives:

1. **Shield of Honor™ Initiative**: Automated philanthropic tokens with transparent fund management
2. **OmniGambling NFT Marketplace**: NFT marketplace with integrated charitable donation mechanisms

## Features

### Shield of Honor™ Initiative

- **HonorCoin (ERC-20)**: Philanthropic token with 7.77% automatic fee allocation
- **Smart Contract Treasury**: Transparent fund management with automated disbursements
- **NFT Staking**: Stake NFTs to earn rewards and governance voting rights
- **NFT Audit Trail**: Blockchain-based transparency for fund utilization
- **Chainlink Oracle Integration**: Milestone-triggered fund disbursement

### OmniGambling NFT Marketplace

- **Tokenized Donations**: Users can donate portions of gambling rewards
- **NFT Tracking**: Donations tracked via NFT records for stakeholder rewards
- **Staking Models**: Sustained charitable support through asset staking
- **Charitable Causes**: Multiple causes with transparent tracking
- **Fractional Rewards**: Stakeholder rewards through fractional asset sharing

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Shield of Honor™                         │
├─────────────────────────────────────────────────────────────┤
│  HonorCoin (ERC-20)                                         │
│  ├── 7.77% automatic fee on transfers                       │
│  ├── Treasury address configuration                         │
│  └── Fee exemptions for contracts                           │
│                                                              │
│  ShieldOfHonorTreasury                                      │
│  ├── Milestone management                                   │
│  ├── Automated disbursements (Chainlink)                    │
│  ├── Role-based access control                              │
│  └── Complete audit trail                                   │
│                                                              │
│  HonorNFTStaking                                            │
│  ├── NFT staking for rewards                                │
│  ├── Governance voting                                      │
│  └── Proposal management                                    │
│                                                              │
│  HonorAuditNFT (ERC-721)                                    │
│  └── NFT-based audit records                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              OmniGambling NFT Marketplace                    │
├─────────────────────────────────────────────────────────────┤
│  OmniGamblingMarketplace                                    │
│  ├── NFT listing and trading                                │
│  ├── Optional donations on purchases                        │
│  ├── Charitable cause management                            │
│  ├── Direct donation mechanism                              │
│  ├── Donation tracking via NFTs                             │
│  └── Fee management (2.5% default)                          │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contracts

### 1. HonorCoin.sol
- **Type**: ERC-20 Token
- **Purpose**: Philanthropic token with automatic fee allocation
- **Key Features**:
  - 7.77% (777 basis points) fee on all transfers
  - Automatic transfer to treasury
  - Configurable fee exemptions
  - Total fees tracking

### 2. ShieldOfHonorTreasury.sol
- **Type**: Treasury Management
- **Purpose**: Manage ethical support fund with transparency
- **Key Features**:
  - Milestone-based disbursements
  - Chainlink Automation compatible
  - Role-based access control (Admin, Manager, Auditor)
  - Complete audit trail with event logs
  - NFT audit integration

### 3. HonorNFTStaking.sol
- **Type**: NFT Staking & Governance
- **Purpose**: Reward NFT holders with governance rights
- **Key Features**:
  - Stake NFTs to earn HonorCoin rewards
  - Governance proposal creation and voting
  - Voting power based on stake duration
  - Minimum 7-day stake for voting rights
  - Reward calculation based on time staked

### 4. OmniGamblingMarketplace.sol
- **Type**: NFT Marketplace
- **Purpose**: NFT trading with integrated charitable giving
- **Key Features**:
  - List and purchase NFTs with HonorCoin
  - Optional donations on purchases
  - Direct donation mechanism
  - Multiple charitable causes
  - Donation tracking via NFT records
  - User donation history tracking

### 5. HonorAuditNFT.sol
- **Type**: ERC-721 NFT
- **Purpose**: Transparent audit trail
- **Key Features**:
  - Mint NFTs as proof of fund utilization
  - Metadata includes amount, purpose, beneficiary
  - Permanent on-chain record
  - Accessible to all stakeholders

## Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Testing

Comprehensive test suites are provided for all contracts:

- **HonorCoin.test.js**: Tests token functionality, fee application, and treasury management
- **ShieldOfHonorTreasury.test.js**: Tests milestone management, disbursements, and audit trail
- **OmniGamblingMarketplace.test.js**: Tests marketplace operations, donations, and cause management

Run all tests:
```bash
npm test
```

## Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

Quick deployment:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Security Features

1. **Access Control**: Role-based permissions using OpenZeppelin's AccessControl
2. **Reentrancy Protection**: All sensitive functions protected with ReentrancyGuard
3. **Input Validation**: Comprehensive checks on all user inputs
4. **Safe Math**: Using Solidity 0.8.x built-in overflow protection
5. **Audit Trail**: All actions logged with events
6. **Fee Limits**: Maximum fee percentages to prevent abuse

## Compliance & Regulations

### Global Accessibility

The system is designed to accommodate multi-jurisdictional philanthropic standards:

1. **Transparent Operations**: All transactions recorded on-chain
2. **Audit Trail**: NFT-based proof of fund utilization
3. **Flexible Configuration**: Adaptable to regional requirements
4. **Privacy Options**: Balance transparency with data protection

### Regulatory Considerations

- KYC/AML compliance can be added at the application layer
- Data privacy (GDPR, CCPA) through selective disclosure
- Tax reporting through event logs and audit trail
- Securities law compliance through token design

## Chainlink Integration

### Chainlink Automation

The Treasury contract implements `AutomationCompatibleInterface` for automated milestone completion:

```solidity
function checkUpkeep(bytes calldata checkData)
    external view returns (bool upkeepNeeded, bytes memory performData)

function performUpkeep(bytes calldata performData) external
```

### Future Enhancements

- **Price Feeds**: Dynamic reward rates based on token price
- **VRF Integration**: Random selection for special rewards
- **External Data**: Milestone triggers based on real-world events

## Gas Optimization

- Efficient storage patterns
- Batch operations where possible
- Minimal state changes
- Optimized loops and conditionals

## Roadmap

### Phase 1: Core Functionality (Completed)
- [x] HonorCoin with automatic fees
- [x] Treasury with milestone management
- [x] NFT staking with governance
- [x] Marketplace with donations
- [x] Audit NFTs

### Phase 2: Integration & Enhancement
- [ ] Chainlink Automation deployment
- [ ] Frontend dApp development
- [ ] Additional oracle integrations
- [ ] Cross-chain bridge support

### Phase 3: Advanced Features
- [ ] Fractional NFT ownership
- [ ] Advanced governance mechanisms
- [ ] DAO treasury management
- [ ] Multi-signature operations

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Open an issue on GitHub
- Review documentation in `/docs`
- Check test files for usage examples

## Acknowledgments

- OpenZeppelin for secure contract templates
- Chainlink for oracle and automation infrastructure
- The Ethereum and Polygon communities

---

Built with ❤️ for the Shield of Honor™ Initiative and OmniGambling NFT Marketplace
