# Quick Reference Guide

## Smart Contract Functions

### HonorCoin

#### User Functions
```solidity
// Transfer tokens (7.77% fee applies)
transfer(address to, uint256 amount)

// Approve spender
approve(address spender, uint256 amount)

// Transfer from approved address
transferFrom(address from, address to, uint256 amount)

// View functions
balanceOf(address account) → uint256
totalSupply() → uint256
treasuryAddress() → address
totalFeesCollected() → uint256
isExemptFromFees(address account) → bool
```

#### Owner Functions
```solidity
setTreasuryAddress(address newTreasury)
setFeeExemption(address account, bool exempt)
```

### ShieldOfHonorTreasury

#### Manager Functions
```solidity
// Create milestone
createMilestone(
    string description,
    uint256 targetAmount,
    uint256 disbursementAmount,
    address beneficiary
)

// Complete milestone manually
completeMilestone(uint256 milestoneId)

// Disburse funds
disburseFunds(
    address beneficiary,
    uint256 amount,
    string purpose
)
```

#### Public Functions
```solidity
// Receive funds
receiveFunds(uint256 amount)

// View functions
milestones(uint256 id) → Milestone
getTreasuryBalance() → uint256
getMilestoneCount() → uint256
getAuditTrailLength() → uint256
```

#### Chainlink Functions
```solidity
checkUpkeep(bytes calldata) → (bool, bytes)
performUpkeep(bytes calldata)
```

### HonorNFTStaking

#### User Functions
```solidity
// Staking
stakeNFT(uint256 tokenId)
unstakeNFT(uint256 tokenId)
claimRewards(uint256 tokenId)

// Voting
vote(uint256 proposalId, bool support)

// View functions
calculateRewards(uint256 tokenId) → uint256
getVotingPower(address user) → uint256
getStakedTokens(address user) → uint256[]
stakes(uint256 tokenId) → StakeInfo
```

#### Owner Functions
```solidity
createProposal(string description) → uint256
executeProposal(uint256 proposalId)
setRewardRate(uint256 rewardRatePerDay)
```

### OmniGamblingMarketplace

#### Seller Functions
```solidity
// List NFT
listNFT(
    address nftContract,
    uint256 tokenId,
    uint256 price
)

// Unlist NFT
unlistNFT(address nftContract, uint256 tokenId)
```

#### Buyer Functions
```solidity
// Purchase with optional donation
purchaseNFT(
    address nftContract,
    uint256 tokenId,
    uint256 donationAmount,
    uint256 causeId
)

// Direct donation
makeDonation(uint256 causeId, uint256 amount)
```

#### View Functions
```solidity
getListing(address nftContract, uint256 tokenId) → Listing
charitableCauses(uint256 id) → CharitableCause
getCauseCount() → uint256
getUserDonations(address user, uint256 causeId) → uint256
```

#### Owner Functions
```solidity
createCause(string name, address beneficiary) → uint256
updateCauseStatus(uint256 causeId, bool active)
setMarketplaceFee(uint256 fee)
withdrawFees(address recipient, uint256 amount)
```

### HonorAuditNFT

#### Minter Functions
```solidity
mintAuditNFT(
    address recipient,
    uint256 amount,
    string purpose,
    address beneficiary,
    string proofURI,
    string tokenURI
) → uint256
```

#### View Functions
```solidity
getAuditMetadata(uint256 tokenId) → AuditMetadata
ownerOf(uint256 tokenId) → address
tokenURI(uint256 tokenId) → string
```

## Common Workflows

### Workflow 1: Basic Token Transfer with Fee

```javascript
// User transfers 1000 HONOR tokens
const amount = ethers.parseEther("1000");
await honorCoin.transfer(recipientAddress, amount);

// Result:
// - Recipient receives: 922.3 HONOR (92.23%)
// - Treasury receives: 77.7 HONOR (7.77%)
```

### Workflow 2: Create and Complete Milestone

```javascript
// 1. Manager creates milestone
await treasury.createMilestone(
    "Community Support",
    ethers.parseEther("10000"),  // Target: 10k HONOR
    ethers.parseEther("8000"),   // Disburse: 8k HONOR
    beneficiaryAddress
);

// 2. Fund treasury to reach target
await honorCoin.approve(treasuryAddress, amount);
await treasury.receiveFunds(amount);

// 3. Chainlink Automation automatically completes
// OR manually complete:
await treasury.completeMilestone(0);
```

### Workflow 3: Stake NFT and Vote

```javascript
// 1. Approve staking contract
await nftContract.approve(stakingAddress, tokenId);

// 2. Stake NFT
await staking.stakeNFT(tokenId);

// 3. Wait 7 days for voting rights

// 4. Vote on proposal
await staking.vote(proposalId, true); // true = support

// 5. Claim rewards anytime
await staking.claimRewards(tokenId);

// 6. Unstake when done
await staking.unstakeNFT(tokenId);
```

### Workflow 4: Buy NFT with Donation

```javascript
// 1. Approve payment token
const price = ethers.parseEther("100");
const donation = ethers.parseEther("10");
const total = price + donation;
await honorCoin.approve(marketplaceAddress, total);

// 2. Purchase with donation
await marketplace.purchaseNFT(
    nftContractAddress,
    tokenId,
    donation,
    causeId  // Which charity to support
);

// Result:
// - NFT transferred to buyer
// - Seller receives payment (minus 2.5% fee)
// - Charity receives donation
// - Donation NFT created as proof
```

### Workflow 5: Create Charitable Cause

```javascript
// Owner creates a new cause
const txn = await marketplace.createCause(
    "Ocean Conservation",
    charityWalletAddress
);
const receipt = await txn.wait();

// Get cause ID from event
const causeId = receipt.events[0].args.causeId;
```

## Constants & Parameters

### Fee Structures

| Contract | Fee Type | Percentage | Basis Points |
|----------|----------|------------|--------------|
| HonorCoin | Transfer Fee | 7.77% | 777 |
| Marketplace | Trading Fee | 2.5% | 250 |
| Marketplace | Suggested Donation | 5% | 500 |

### Time Periods

| Parameter | Duration |
|-----------|----------|
| Min Stake for Voting | 7 days |
| Proposal Duration | 7 days |

### Limits

| Parameter | Limit |
|-----------|-------|
| Max Marketplace Fee | 10% (1000 bp) |
| Max Suggested Donation | 50% (5000 bp) |

## Events

### HonorCoin Events
```solidity
event TreasuryUpdated(address oldTreasury, address newTreasury)
event FeesCollected(address from, address to, uint256 amount)
event ExemptionUpdated(address account, bool exempt)
```

### Treasury Events
```solidity
event MilestoneCreated(uint256 milestoneId, string description, uint256 targetAmount)
event MilestoneCompleted(uint256 milestoneId, uint256 amount, address beneficiary)
event FundsReceived(address from, uint256 amount)
event FundsDisbursed(address to, uint256 amount, string purpose)
event AuditRecordCreated(uint256 recordId, string action)
```

### Staking Events
```solidity
event NFTStaked(address user, uint256 tokenId)
event NFTUnstaked(address user, uint256 tokenId)
event RewardsClaimed(address user, uint256 amount)
event ProposalCreated(uint256 proposalId, string description)
event VoteCast(uint256 proposalId, address voter, bool support)
```

### Marketplace Events
```solidity
event Listed(address seller, address nftContract, uint256 tokenId, uint256 price)
event Purchased(address buyer, address nftContract, uint256 tokenId, uint256 price)
event DonationMade(address donor, uint256 causeId, uint256 amount, uint256 nftId)
event CauseCreated(uint256 causeId, string name, address beneficiary)
```

## Error Messages

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Transfer from zero address" | Invalid sender | Check address |
| "Insufficient balance" | Not enough tokens | Add more tokens |
| "Not the owner" | Wrong NFT owner | Use correct account |
| "Already staked" | NFT already staked | Unstake first |
| "Milestone already completed" | Duplicate completion | Check milestone status |
| "Cause not active" | Inactive charity | Choose active cause |
| "Voting ended" | Proposal expired | Wait for new proposal |
| "No voting power" | No staked NFTs | Stake NFT first |

## Gas Estimates (Approximate)

| Operation | Estimated Gas |
|-----------|---------------|
| HonorCoin Transfer | ~65,000 |
| Stake NFT | ~120,000 |
| Unstake NFT | ~80,000 |
| Create Milestone | ~150,000 |
| Complete Milestone | ~200,000 |
| List NFT | ~90,000 |
| Purchase NFT | ~250,000 |
| Create Vote | ~100,000 |
| Cast Vote | ~70,000 |

*Note: Actual gas costs vary based on network conditions and transaction complexity*

## Roles & Permissions

### Treasury Roles

| Role | Permissions |
|------|-------------|
| DEFAULT_ADMIN_ROLE | Grant/revoke roles, set audit NFT contract |
| DISBURSEMENT_MANAGER_ROLE | Create milestones, disburse funds, complete milestones |
| AUDITOR_ROLE | View audit trail (future: create audit records) |

### Audit NFT Roles

| Role | Permissions |
|------|-------------|
| DEFAULT_ADMIN_ROLE | Grant/revoke minter role |
| MINTER_ROLE | Mint audit NFTs |

## Testing Commands

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/HonorCoin.test.js

# Run with gas reporting
REPORT_GAS=true npm test

# Run with coverage
npm run test:coverage

# Compile contracts
npm run compile

# Clean artifacts
npm run clean
```

## Useful Hardhat Commands

```bash
# Start local network
npx hardhat node

# Deploy to network
npx hardhat run scripts/deploy.js --network <network-name>

# Verify contract
npx hardhat verify --network <network> <address> <constructor-args>

# Get accounts
npx hardhat accounts

# Check contract size
npx hardhat size-contracts

# Clean and recompile
npx hardhat clean && npx hardhat compile
```

## Web3 Integration Examples

### Ethers.js v6

```javascript
import { ethers } from "ethers";

// Connect to provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Connect wallet
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Get contract instance
const honorCoin = new ethers.Contract(
    HONOR_COIN_ADDRESS,
    HONOR_COIN_ABI,
    wallet
);

// Transfer tokens
const tx = await honorCoin.transfer(
    recipientAddress,
    ethers.parseEther("100")
);
await tx.wait();
```

### Frontend Integration

```javascript
// Connect MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();

// Get contract
const contract = new ethers.Contract(address, abi, signer);

// Call function
const tx = await contract.functionName(args);
const receipt = await tx.wait();
```

---

For more detailed information, see:
- [BLOCKCHAIN_README.md](BLOCKCHAIN_README.md) - Complete overview
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Deployment instructions
- Contract source code in `contracts/` directory
