# Inter-Realm Architecture Deployment Guide

**Version:** 1.0.0  
**Author:** Chais Hill | Omnitech1  
**Last Updated:** 2025-11-14

## Overview

This guide provides step-by-step instructions for deploying the Inter-Realm Architecture for the OmniGambling Revolution.

## Prerequisites

### Required Software

- Node.js v18+ and npm/yarn
- Hardhat or Truffle framework
- MetaMask or compatible Web3 wallet
- Access to EVM-compatible blockchain (Ethereum, Polygon, BSC, etc.)

### Required Knowledge

- Solidity smart contract deployment
- Blockchain transaction management
- Zero-knowledge proof basics
- Web3 integration

## Network Configuration

### Supported Networks

1. **Ethereum Mainnet**: Production deployment
2. **Polygon**: High-throughput L2 solution
3. **Optimism**: Optimistic rollup layer
4. **Arbitrum**: Alternative L2 scaling
5. **Testnet Networks**: Sepolia, Mumbai, Goerli

### Network Requirements

- Sufficient native tokens for gas fees
- RPC endpoint access
- Etherscan API key (for verification)

## Pre-Deployment Setup

### 1. Environment Configuration

Create a `.env` file in your project root:

```bash
# Network Configuration
NETWORK=mainnet
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
CHAIN_ID=1

# Wallet Configuration
DEPLOYER_PRIVATE_KEY=your_private_key_here
ADMIN_ADDRESS=0x...

# Contract Configuration
GAS_PRICE=50000000000
GAS_LIMIT=8000000

# Verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# ZK Configuration
ZK_PROVING_KEY_PATH=./keys/proving_key.json
ZK_VERIFICATION_KEY_PATH=./keys/verification_key.json
```

### 2. Install Dependencies

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
npm install @openzeppelin/contracts
```

### 3. Configure Hardhat

Create `hardhat.config.js`:

```javascript
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mainnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 1
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 137
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

## Deployment Steps

### Step 1: Deploy ZKRollupVerifier

```javascript
// scripts/1_deploy_verifier.js
async function main() {
  console.log("Deploying ZKRollupVerifier...");
  
  const ZKRollupVerifier = await ethers.getContractFactory("ZKRollupVerifier");
  const verifier = await ZKRollupVerifier.deploy();
  await verifier.deployed();
  
  console.log("ZKRollupVerifier deployed to:", verifier.address);
  
  // Save deployment address
  const fs = require('fs');
  const deployments = {
    zkVerifier: verifier.address,
    network: network.name,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    './deployments.json',
    JSON.stringify(deployments, null, 2)
  );
  
  return verifier.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run deployment:
```bash
npx hardhat run scripts/1_deploy_verifier.js --network mainnet
```

### Step 2: Initialize Verification Key

```javascript
// scripts/2_initialize_vk.js
async function main() {
  const deployments = require('./deployments.json');
  const verifier = await ethers.getContractAt(
    "ZKRollupVerifier",
    deployments.zkVerifier
  );
  
  // Load verification key (generated offline)
  const vk = require('./keys/verification_key.json');
  
  console.log("Initializing verification key...");
  const tx = await verifier.initializeVerificationKey(
    vk.alpha,
    vk.beta,
    vk.gamma,
    vk.delta,
    vk.ic
  );
  await tx.wait();
  
  console.log("Verification key initialized");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 3: Deploy InterRealmAssetRegistry

```javascript
// scripts/3_deploy_registry.js
async function main() {
  console.log("Deploying InterRealmAssetRegistry...");
  
  const Registry = await ethers.getContractFactory("InterRealmAssetRegistry");
  const registry = await Registry.deploy();
  await registry.deployed();
  
  console.log("InterRealmAssetRegistry deployed to:", registry.address);
  
  // Update deployments file
  const fs = require('fs');
  const deployments = require('./deployments.json');
  deployments.assetRegistry = registry.address;
  
  fs.writeFileSync(
    './deployments.json',
    JSON.stringify(deployments, null, 2)
  );
  
  return registry.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 4: Register Initial Realms

```javascript
// scripts/4_register_realms.js
async function main() {
  const deployments = require('./deployments.json');
  const registry = await ethers.getContractAt(
    "InterRealmAssetRegistry",
    deployments.assetRegistry
  );
  
  // Define initial realms
  const realms = [
    { name: "Ethereum Realm", verifier: "0x..." },
    { name: "Polygon Realm", verifier: "0x..." },
    { name: "ScrollVerse Realm", verifier: "0x..." },
    { name: "OmniDAO Realm", verifier: "0x..." }
  ];
  
  console.log("Registering realms...");
  
  for (const realm of realms) {
    const tx = await registry.registerRealm(realm.name, realm.verifier);
    const receipt = await tx.wait();
    console.log(`Registered: ${realm.name}`);
  }
  
  console.log("All realms registered successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 5: Deploy InterRealmBridge

```javascript
// scripts/5_deploy_bridge.js
async function main() {
  const deployments = require('./deployments.json');
  
  console.log("Deploying InterRealmBridge...");
  
  const Bridge = await ethers.getContractFactory("InterRealmBridge");
  const bridge = await Bridge.deploy(
    deployments.assetRegistry,
    deployments.zkVerifier
  );
  await bridge.deployed();
  
  console.log("InterRealmBridge deployed to:", bridge.address);
  
  // Update deployments file
  const fs = require('fs');
  deployments.bridge = bridge.address;
  deployments.deploymentComplete = true;
  
  fs.writeFileSync(
    './deployments.json',
    JSON.stringify(deployments, null, 2)
  );
  
  return bridge.address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 6: Configure Bridge Validators

```javascript
// scripts/6_configure_validators.js
async function main() {
  const deployments = require('./deployments.json');
  const bridge = await ethers.getContractAt(
    "InterRealmBridge",
    deployments.bridge
  );
  
  // Configure validators for each realm
  const validators = {
    1: "0x...", // Ethereum Realm
    2: "0x...", // Polygon Realm
    3: "0x...", // ScrollVerse Realm
    4: "0x..."  // OmniDAO Realm
  };
  
  console.log("Configuring validators...");
  
  for (const [realmId, validator] of Object.entries(validators)) {
    const tx = await bridge.setRealmValidator(realmId, validator);
    await tx.wait();
    console.log(`Validator set for realm ${realmId}`);
  }
  
  console.log("All validators configured");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 7: Verify Contracts

```bash
# Verify ZKRollupVerifier
npx hardhat verify --network mainnet <VERIFIER_ADDRESS>

# Verify InterRealmAssetRegistry
npx hardhat verify --network mainnet <REGISTRY_ADDRESS>

# Verify InterRealmBridge
npx hardhat verify --network mainnet <BRIDGE_ADDRESS> <REGISTRY_ADDRESS> <VERIFIER_ADDRESS>
```

## Post-Deployment Configuration

### 1. Set Fee Structure

```javascript
const bridge = await ethers.getContractAt("InterRealmBridge", BRIDGE_ADDRESS);
await bridge.updateFees(
  ethers.utils.parseEther("0.001"),  // Base fee
  ethers.utils.parseEther("0.01")    // Intergalactic fee
);
```

### 2. Add Trusted Sequencers

```javascript
const verifier = await ethers.getContractAt("ZKRollupVerifier", VERIFIER_ADDRESS);
await verifier.addSequencer("0xSequencerAddress1");
await verifier.addSequencer("0xSequencerAddress2");
```

### 3. Transfer Admin Rights (Optional)

```javascript
// Transfer to multi-sig or DAO
await registry.transferOwnership(MULTISIG_ADDRESS);
await bridge.transferOwnership(MULTISIG_ADDRESS);
await verifier.transferOwnership(MULTISIG_ADDRESS);
```

## Testing Deployment

### Basic Functionality Test

```javascript
// scripts/test_deployment.js
async function main() {
  const deployments = require('./deployments.json');
  
  const registry = await ethers.getContractAt(
    "InterRealmAssetRegistry",
    deployments.assetRegistry
  );
  
  // Test asset registration
  console.log("Testing asset registration...");
  const tx1 = await registry.registerAsset(
    1, // realmId
    1, // galaxyId
    ethers.utils.formatBytes32String("TestAsset"),
    ethers.utils.parseEther("1.0")
  );
  await tx1.wait();
  console.log("Asset registered successfully");
  
  // Test transfer initiation
  const bridge = await ethers.getContractAt(
    "InterRealmBridge",
    deployments.bridge
  );
  
  console.log("Testing transfer initiation...");
  const tx2 = await bridge.initiateTransfer(
    1, // assetId
    "0xRecipientAddress",
    1, // sourceRealmId
    2, // destinationRealmId
    1, // sourceGalaxyId
    1, // destinationGalaxyId
    { value: ethers.utils.parseEther("0.001") }
  );
  await tx2.wait();
  console.log("Transfer initiated successfully");
  
  console.log("All tests passed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Monitoring and Maintenance

### Set Up Event Listeners

```javascript
const bridge = await ethers.getContractAt("InterRealmBridge", BRIDGE_ADDRESS);

bridge.on("TransferInitiated", (transferId, assetId, sender, recipient) => {
  console.log(`Transfer ${transferId} initiated from ${sender} to ${recipient}`);
});

bridge.on("TransferCompleted", (transferId, timestamp) => {
  console.log(`Transfer ${transferId} completed at ${timestamp}`);
});
```

### Monitor Key Metrics

```javascript
// Check batch verification rate
const verifier = await ethers.getContractAt("ZKRollupVerifier", VERIFIER_ADDRESS);
const batchCount = await verifier.batchCounter();
console.log(`Total batches processed: ${batchCount}`);

// Check transfer statistics
const transferCount = await bridge.transferCounter();
console.log(`Total transfers: ${transferCount}`);
```

## Troubleshooting

### Common Issues

1. **Gas Estimation Failure**: Increase gas limit in hardhat config
2. **Nonce Too Low**: Wait for previous transactions to confirm
3. **Insufficient Funds**: Ensure deployer wallet has enough tokens
4. **Contract Verification Failed**: Check constructor arguments

### Emergency Procedures

1. **Pause Transfers**: Call emergency pause function (if implemented)
2. **Update Validators**: Rotate compromised validators immediately
3. **Fee Adjustment**: Adjust fees if network congestion occurs
4. **State Rollback**: Use admin functions for critical issues

## Security Checklist

- [ ] All private keys stored securely
- [ ] Multi-signature wallet for admin functions
- [ ] Regular security audits scheduled
- [ ] Monitoring and alerting systems active
- [ ] Backup and recovery procedures documented
- [ ] Rate limiting on critical functions
- [ ] Access control properly configured
- [ ] Smart contract verification completed

## Support and Resources

### Documentation
- Architecture Overview: `docs/architecture/INTER_REALM_ARCHITECTURE.md`
- API Reference: `docs/architecture/API_REFERENCE.md`
- Security Guide: `docs/architecture/SECURITY.md`

### Community
- GitHub: [Repository Link]
- Discord: [Community Server]
- Telegram: [Support Channel]

### Contact
**Project Lead:** Chais Hill  
**Organization:** Omnitech1  
**Email:** [Support Email]

---

**Note:** Always test deployments on testnet before mainnet deployment. Keep deployment addresses and transaction hashes for audit trails.
