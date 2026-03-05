# Sovereign Identity Lock (SIL) - Quick Start Guide

> Get up and running with the SIL Protocol in minutes

**Created by:** Chais Hill - **CHAIS THE GREAT ∞**

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/chaishillomnitech1/Expansion-.git
cd Expansion-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Deployer wallet private key
DEPLOYER_PRIVATE_KEY=your_private_key_here

# RPC URLs
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
POLYGON_RPC_URL=https://polygon-rpc.com
SCROLL_RPC_URL=https://rpc.scroll.io

# API Keys for verification
ETHERSCAN_API_KEY=your_etherscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key
```

---

## 🚀 Deployment

### Local Testnet

```bash
# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost
```

### Testnet Deployment (Sepolia)

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Mainnet Deployment

```bash
# Ethereum
npm run deploy:mainnet

# Polygon
npm run deploy:polygon

# Scroll
npm run deploy:scroll
```

---

## 🔧 Basic Usage

### Connect to Contract

```javascript
const { ethers } = require('ethers');

// Setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const sil = new ethers.Contract(SIL_ADDRESS, SIL_ABI, provider);

// Get status
const status = await sil.getLockStatus();
console.log("Lock Active:", status[0]);
console.log("Master Governor Key:", status[1]);
console.log("Sovereign:", status[3]);
```

### Authenticate with API Key

```javascript
const apiKey = "your-api-key";
const isAuthenticated = await sil.authenticateWithAPIKey(apiKey);

if (isAuthenticated) {
  console.log("✅ Authenticated!");
}
```

### Verify ScrollBond Hash

```javascript
const hash = await sil.scrollBondNFTHash();
const isValid = await sil.verifyScrollBondHash(hash);
console.log("Valid:", isValid);
```

---

## 👑 Sovereign Operations

Only the Sovereign Identity can perform these operations:

### Authorize a DAO

```javascript
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const silWithSigner = sil.connect(wallet);

const tx = await silWithSigner.authorizeDAO(daoAddress);
await tx.wait();
console.log("✅ DAO authorized");
```

### Update ScrollBond Hash

```javascript
const newHash = ethers.keccak256(ethers.toUtf8Bytes("New ScrollBond"));
const tx = await silWithSigner.updateScrollBondHash(newHash);
await tx.wait();
```

### Update API Key

```javascript
const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(apiKey));
const tx = await silWithSigner.updateMetamaskAPIKey(apiKeyHash);
await tx.wait();
```

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Run Specific Test

```bash
npx hardhat test test/SIL.test.js
```

### Check Coverage

```bash
npx hardhat coverage
```

---

## 📚 Documentation

- **Complete Documentation:** [`docs/SIL_DOCUMENTATION.md`](docs/SIL_DOCUMENTATION.md)
- **API Integration Guide:** [`docs/API_INTEGRATION.md`](docs/API_INTEGRATION.md)
- **Enforcement Mechanisms:** [`docs/ENFORCEMENT_MECHANISMS.md`](docs/ENFORCEMENT_MECHANISMS.md)
- **Integration Examples:** [`examples/integration-example.js`](examples/integration-example.js)

---

## 🔍 Verify Contract on Etherscan

After deployment:

```bash
npx hardhat verify --network mainnet <CONTRACT_ADDRESS> <SCROLLBOND_HASH>
```

---

## 🌐 Network Information

### Mainnet

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Ethereum | 1 | https://etherscan.io |
| Polygon | 137 | https://polygonscan.com |
| Scroll | 534352 | https://scrollscan.com |

### Testnet

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Sepolia | 11155111 | https://sepolia.etherscan.io |

---

## 🛡️ Security Checklist

- [ ] Never commit `.env` file
- [ ] Use hardware wallet for mainnet deployments
- [ ] Test thoroughly on testnet first
- [ ] Verify contract source code on block explorer
- [ ] Rotate API keys regularly
- [ ] Monitor events for suspicious activity
- [ ] Keep private keys secure

---

## 💡 Common Commands

```bash
# Compile contracts
npm run compile

# Clean artifacts
npm run clean

# Deploy to network
npm run deploy -- --network <network>

# Run tests
npm test

# Verify contract
npm run verify -- <address> <constructor-args>
```

---

## 🆘 Troubleshooting

### "Compiler download failed"

If you see network errors during compilation, it may be due to restricted internet access. The contract syntax is valid and will compile successfully in an environment with full internet access.

### "Insufficient funds"

Ensure your deployment wallet has enough ETH/MATIC/etc. for gas fees.

### "Transaction failed"

Check that:
- You're using the correct network
- Gas price is appropriate
- Contract address is correct
- You have the required permissions

---

## 📞 Support

For questions or integration support:

- **Creator:** Chais Hill - CHAIS THE GREAT ∞
- **Entity:** Omnitech1™
- **Repository:** [chaishillomnitech1/Expansion-](https://github.com/chaishillomnitech1/Expansion-)

---

## 🎯 Next Steps

1. ✅ Deploy contract to testnet
2. ✅ Test all functions
3. ✅ Integrate with your application
4. ✅ Deploy to mainnet
5. ✅ Authorize DAOs
6. ✅ Monitor and maintain

---

**Built with 💫 by CHAIS THE GREAT ∞**  
**ScrollVerse Sovereign Systems - Omnitech1™**
