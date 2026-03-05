# Deployment Guide

## Prerequisites

- Node.js v22.10.0 or later (LTS version with even major version number)
- npm or yarn
- Hardhat development environment
- Access to an Ethereum node (Infura, Alchemy, or local node)

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Compile Smart Contracts**
   ```bash
   npm run compile
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

## Smart Contracts Overview

### 1. HonorCoin (ERC-20 Token)
- **Purpose**: Philanthropic token with automated 7.77% fee allocation
- **Features**:
  - Automatic fee collection on transfers
  - Treasury management
  - Fee exemptions for specific addresses
  - Transparent tracking of collected fees

### 2. ShieldOfHonorTreasury
- **Purpose**: Manages ethical support fund with milestone-triggered disbursements
- **Features**:
  - Milestone management
  - Automated disbursements using Chainlink Automation
  - Role-based access control
  - Complete audit trail
  - Fund tracking and reporting

### 3. HonorNFTStaking
- **Purpose**: NFT staking with governance voting rights
- **Features**:
  - Stake NFTs to earn rewards
  - Governance proposals and voting
  - Voting power based on stake duration
  - Reward claiming mechanism

### 4. OmniGamblingMarketplace
- **Purpose**: NFT marketplace with integrated philanthropic mechanisms
- **Features**:
  - List and purchase NFTs
  - Optional donations on purchases
  - Direct donations to charitable causes
  - Donation tracking via NFT records
  - Fractional rewards for stakeholders

### 5. HonorAuditNFT
- **Purpose**: NFT-based audit trail for transparency
- **Features**:
  - Mint audit NFTs for fund utilization records
  - Verifiable proof of disbursement
  - Metadata tracking (amount, purpose, beneficiary)

## Deployment Steps

### Step 1: Configure Environment

Create a `.env` file with the following variables:

```env
PRIVATE_KEY=your_deployer_private_key
INFURA_API_KEY=your_infura_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Step 2: Update Hardhat Configuration

Ensure `hardhat.config.js` includes your target networks:

```javascript
networks: {
  sepolia: {
    url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts: [process.env.PRIVATE_KEY]
  },
  polygon: {
    url: `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

### Step 3: Deploy Contracts

Create a deployment script `scripts/deploy.js`:

```javascript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // 1. Deploy HonorCoin
  const HonorCoin = await ethers.getContractFactory("HonorCoin");
  const honorCoin = await HonorCoin.deploy(
    "HonorCoin",
    "HONOR",
    ethers.parseEther("1000000000"), // 1 billion tokens
    deployer.address // Initial treasury
  );
  await honorCoin.waitForDeployment();
  console.log("HonorCoin deployed to:", await honorCoin.getAddress());

  // 2. Deploy Treasury
  const Treasury = await ethers.getContractFactory("ShieldOfHonorTreasury");
  const treasury = await Treasury.deploy(await honorCoin.getAddress());
  await treasury.waitForDeployment();
  console.log("Treasury deployed to:", await treasury.getAddress());

  // 3. Update HonorCoin treasury address
  await honorCoin.setTreasuryAddress(await treasury.getAddress());
  console.log("HonorCoin treasury updated");

  // 4. Deploy Audit NFT
  const AuditNFT = await ethers.getContractFactory("HonorAuditNFT");
  const auditNFT = await AuditNFT.deploy();
  await auditNFT.waitForDeployment();
  console.log("AuditNFT deployed to:", await auditNFT.getAddress());

  // 5. Set Audit NFT in Treasury
  await treasury.setAuditNFTContract(await auditNFT.getAddress());
  console.log("Audit NFT set in Treasury");

  // 6. Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("OmniGamblingMarketplace");
  const marketplace = await Marketplace.deploy(await honorCoin.getAddress());
  await marketplace.waitForDeployment();
  console.log("Marketplace deployed to:", await marketplace.getAddress());

  // 7. Deploy NFT Staking (requires an NFT contract address)
  // Uncomment when you have an NFT contract
  /*
  const Staking = await ethers.getContractFactory("HonorNFTStaking");
  const staking = await Staking.deploy(
    nftContractAddress,
    await honorCoin.getAddress(),
    ethers.parseEther("10") // 10 tokens per day reward
  );
  await staking.waitForDeployment();
  console.log("Staking deployed to:", await staking.getAddress());
  */

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("HonorCoin:", await honorCoin.getAddress());
  console.log("Treasury:", await treasury.getAddress());
  console.log("AuditNFT:", await auditNFT.getAddress());
  console.log("Marketplace:", await marketplace.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Deploy to network:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Step 4: Verify Contracts on Etherscan

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "constructor" "arguments"
```

## Chainlink Integration

### Chainlink Automation Setup

1. Visit [Chainlink Automation](https://automation.chain.link/)
2. Register a new upkeep with the Treasury contract address
3. Fund the upkeep with LINK tokens
4. Configure check frequency and gas limits

### Chainlink Oracle Integration (Future Enhancement)

For milestone-triggered disbursements based on external data:

1. Deploy a Chainlink oracle consumer contract
2. Create job specifications for data feeds
3. Connect oracle to treasury contract
4. Fund oracle with LINK tokens

## Testing

Run the complete test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Security Considerations

1. **Access Control**: All critical functions use role-based access control (RBAC)
2. **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
3. **Fee Management**: Fixed fee percentage prevents manipulation
4. **Audit Trail**: All transactions recorded with NFT-based proof
5. **Multi-jurisdictional Compliance**: Design accommodates various regulatory frameworks

## Multi-Jurisdictional Compliance

### Global Accessibility Features

1. **Transparent Operations**: All transactions recorded on-chain
2. **Audit Trail**: NFT-based proof of fund utilization
3. **Role-Based Permissions**: Compliant with organizational governance
4. **Flexible Fee Structure**: Adaptable to different regulatory requirements

### Compliance Checklist

- [ ] KYC/AML procedures for high-value transactions
- [ ] Data privacy compliance (GDPR, CCPA)
- [ ] Securities law compliance (if applicable)
- [ ] Tax reporting mechanisms
- [ ] Regional philanthropic regulations

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **HonorCoin**:
   - Total fees collected
   - Treasury balance
   - Transaction volume

2. **Treasury**:
   - Milestone completion rate
   - Total disbursed amount
   - Audit trail length

3. **Marketplace**:
   - Total donations
   - Active charitable causes
   - Trading volume

4. **Staking**:
   - Total staked NFTs
   - Active proposals
   - Governance participation

### Regular Maintenance Tasks

1. Review and approve governance proposals
2. Update charitable causes
3. Monitor Chainlink automation
4. Review audit trail for anomalies
5. Update fee structures if needed

## Support

For technical support or questions:
- GitHub Issues: [Repository Issues Page]
- Documentation: This guide and inline contract documentation
- Community: [Discord/Telegram Channel]

## License

MIT License - See LICENSE file for details
