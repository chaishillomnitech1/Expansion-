# Getting Started

Welcome to the blockchain implementation for Shield of Honor™ Initiative and OmniGambling NFT Marketplace!

## 🚀 Quick Start (5 Minutes)

### Step 1: Prerequisites

Ensure you have:
- **Node.js v22.10.0 or later** (LTS version with even major number)
  ```bash
  node --version  # Should be v22.x or higher
  ```
- **npm** (comes with Node.js)

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Hardhat (Ethereum development environment)
- OpenZeppelin (secure smart contract library)
- Chainlink (oracle integration)
- Ethers.js (Ethereum library)
- Testing tools (Mocha, Chai)

### Step 3: Compile Contracts

```bash
npm run compile
```

Expected output:
```
Compiled 6 Solidity files successfully
```

### Step 4: Run Tests

```bash
npm test
```

Expected output:
```
  HonorCoin
    ✓ Should set the right owner
    ✓ Should assign the total supply to the owner
    ... (45+ tests)

  45 passing (5s)
```

🎉 **Congratulations!** Your blockchain environment is set up!

---

## 📚 What's Included?

### Smart Contracts (`/contracts`)
1. **HonorCoin.sol** - Philanthropic token with 7.77% automatic fee
2. **ShieldOfHonorTreasury.sol** - Treasury with milestone management
3. **HonorNFTStaking.sol** - NFT staking and governance
4. **OmniGamblingMarketplace.sol** - NFT marketplace with donations
5. **HonorAuditNFT.sol** - Audit trail NFTs
6. **TestNFT.sol** - Test NFT for development

### Tests (`/test`)
- `HonorCoin.test.js` - 15 tests
- `ShieldOfHonorTreasury.test.js` - 12 tests
- `OmniGamblingMarketplace.test.js` - 18 tests

### Documentation (`/docs`)
- `BLOCKCHAIN_README.md` - Technical overview
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `QUICK_REFERENCE.md` - Developer reference

---

## 🎯 Next Steps

### For Developers

1. **Explore the Code**
   ```bash
   # View contract code
   cat contracts/HonorCoin.sol
   
   # View tests
   cat test/HonorCoin.test.js
   ```

2. **Run Local Blockchain**
   ```bash
   # Terminal 1: Start local node
   npx hardhat node
   
   # Terminal 2: Deploy contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Read Documentation**
   - Start with: [BLOCKCHAIN_INTEGRATION.md](BLOCKCHAIN_INTEGRATION.md)
   - Then: [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)

### For Project Managers

1. **Review Implementation Summary**
   - Read: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
   - Overview of deliverables and completion status

2. **Check Requirements**
   - All problem statement requirements: ✅ Complete
   - See detailed checklist in IMPLEMENTATION_SUMMARY.md

3. **Plan Deployment**
   - Follow: [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
   - Testnet deployment recommended first

---

## 📖 Key Concepts

### HonorCoin - The Philanthropic Token

HonorCoin automatically allocates 7.77% of every transfer to charity:

```javascript
// User transfers 1000 HONOR
transfer(recipient, 1000 HONOR)

// Result:
// - Recipient gets: 922.3 HONOR (92.23%)
// - Treasury gets: 77.7 HONOR (7.77%)
```

### Treasury - Milestone-Based Disbursement

Funds are released when milestones are reached:

```javascript
// 1. Create milestone
createMilestone(
  "Community Support",
  10000 HONOR,  // Target
  8000 HONOR    // Disburse when reached
)

// 2. Automatically completes when funded
// (via Chainlink Automation)
```

### NFT Staking - Governance Voting

Stake NFTs to earn rewards and vote:

```javascript
// 1. Stake NFT
stakeNFT(tokenId)

// 2. Wait 7 days for voting rights

// 3. Vote on proposals
vote(proposalId, true)  // Support proposal

// 4. Claim rewards anytime
claimRewards(tokenId)
```

### Marketplace - Trading with Charity

Buy NFTs and optionally donate:

```javascript
// Purchase NFT with 10% donation
purchaseNFT(
  nftContract,
  tokenId,
  priceAmount * 0.1,  // 10% donation
  charityId
)
```

---

## 🔧 Common Tasks

### View Account Balance

```bash
npx hardhat console --network localhost
```
```javascript
const [owner] = await ethers.getSigners();
const balance = await ethers.provider.getBalance(owner.address);
console.log("Balance:", ethers.formatEther(balance), "ETH");
```

### Deploy to Testnet

```bash
# 1. Set up .env file
cp .env.example .env
# Edit .env with your keys

# 2. Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

### Verify Contract

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS "constructor" "args"
```

---

## ❓ Troubleshooting

### Error: "Node.js version not supported"

**Solution**: Upgrade to Node.js v22.10.0 or later
```bash
# Using nvm (recommended)
nvm install 22
nvm use 22
```

### Error: "Compilation failed"

**Solution**: Clean and recompile
```bash
npm run clean
npm run compile
```

### Error: "Module not found"

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests Fail

**Solution**: Ensure you're on a fresh state
```bash
npm run clean
npm install
npm test
```

---

## 📚 Learning Resources

### Understanding the Code

1. **Smart Contracts 101**
   - Read: contracts/HonorCoin.sol (simplest contract)
   - Comments explain each function

2. **Testing Patterns**
   - Read: test/HonorCoin.test.js
   - Shows how to test smart contracts

3. **Deployment Process**
   - Read: scripts/deploy.js
   - Shows contract deployment flow

### External Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Chainlink Documentation](https://docs.chain.link/)
- [Ethers.js Documentation](https://docs.ethers.org/)

---

## 🎓 Tutorials

### Tutorial 1: Transfer HonorCoin (5 min)

```javascript
// In Hardhat console
const HonorCoin = await ethers.getContractFactory("HonorCoin");
const honorCoin = await HonorCoin.attach("CONTRACT_ADDRESS");

// Transfer tokens
await honorCoin.transfer(recipientAddress, ethers.parseEther("100"));

// Check balances
const balance = await honorCoin.balanceOf(recipientAddress);
console.log("Balance:", ethers.formatEther(balance));
```

### Tutorial 2: Create a Milestone (10 min)

```javascript
// Get treasury contract
const Treasury = await ethers.getContractFactory("ShieldOfHonorTreasury");
const treasury = await Treasury.attach("CONTRACT_ADDRESS");

// Create milestone
await treasury.createMilestone(
  "First Milestone",
  ethers.parseEther("10000"),  // Target
  ethers.parseEther("8000"),   // Disburse
  beneficiaryAddress
);

// Check milestone
const milestone = await treasury.milestones(0);
console.log("Milestone:", milestone);
```

### Tutorial 3: List an NFT (10 min)

```javascript
// Get marketplace contract
const Marketplace = await ethers.getContractFactory("OmniGamblingMarketplace");
const marketplace = await Marketplace.attach("CONTRACT_ADDRESS");

// Approve marketplace
await nftContract.approve(marketplaceAddress, tokenId);

// List NFT
await marketplace.listNFT(
  nftContractAddress,
  tokenId,
  ethers.parseEther("100")  // Price
);

// Check listing
const listing = await marketplace.getListing(nftContractAddress, tokenId);
console.log("Listing:", listing);
```

---

## 🚦 Project Status

| Component | Status |
|-----------|--------|
| Smart Contracts | ✅ Complete |
| Tests | ✅ Complete (45+ tests) |
| Documentation | ✅ Complete (40,000+ words) |
| Deployment Scripts | ✅ Complete |
| CI/CD Pipeline | ✅ Complete |
| Testnet Deployment | ⏳ Ready |
| Security Audit | ⏳ Pending |
| Frontend dApp | 📋 Planned |

---

## 🤝 Support

### Need Help?

1. **Check Documentation**
   - [QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Function reference
   - [BLOCKCHAIN_README.md](docs/BLOCKCHAIN_README.md) - Technical details

2. **Common Issues**
   - See Troubleshooting section above
   - Check error messages carefully

3. **Ask Questions**
   - Open a GitHub issue
   - Include error messages and steps to reproduce

### Contributing

Want to improve the code? Great!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📝 Useful Commands

```bash
# Development
npm run compile      # Compile contracts
npm test            # Run tests
npm run clean       # Clean artifacts

# Local Deployment
npx hardhat node                                    # Start local blockchain
npx hardhat run scripts/deploy.js --network localhost  # Deploy locally

# Testnet Deployment
npx hardhat run scripts/deploy.js --network sepolia    # Deploy to Sepolia

# Verification
npx hardhat verify --network sepolia ADDRESS ARGS      # Verify on Etherscan

# Testing
npx hardhat test                                    # Run all tests
npx hardhat test test/HonorCoin.test.js            # Run specific test
REPORT_GAS=true npm test                           # Test with gas report

# Console
npx hardhat console --network localhost            # Interactive console
```

---

## 🎉 You're Ready!

You now have everything you need to:
- ✅ Understand the smart contracts
- ✅ Run and modify tests
- ✅ Deploy to local or test networks
- ✅ Integrate with frontend applications

**Next**: Read [BLOCKCHAIN_INTEGRATION.md](BLOCKCHAIN_INTEGRATION.md) for the complete overview!

---

**Questions?** Check the documentation in `/docs` or open an issue.

**Ready to deploy?** Follow [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md).

Happy coding! 🚀
