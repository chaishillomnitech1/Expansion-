# ScrollSoul Anchor Quick Start Guide

## 🚀 5-Minute Setup

Get up and running with the ScrollSoul Anchor system in minutes.

---

## Prerequisites

- Node.js 16+
- npm or yarn
- Git
- MetaMask wallet

---

## Installation

```bash
# Clone the repository (if not already done)
git clone https://github.com/chaishillomnitech1/Expansion-.git
cd Expansion-

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

---

## Configuration

Edit `.env` file:

```env
# For Scroll Sepolia Testnet (recommended for testing)
SCROLL_SEPOLIA_RPC_URL=https://sepolia-rpc.scroll.io
METAMASK_PRIVATE_KEY=your_private_key_here
SCROLLSCAN_API_KEY=your_api_key_here
```

⚠️ **Never commit your `.env` file!**

---

## Quick Commands

### Compile Contracts

```bash
npm run compile
```

### Deploy to Local Network

```bash
# Terminal 1: Start local node
npm run node

# Terminal 2: Deploy
npm run deploy:local
```

### Deploy to Scroll Sepolia (Testnet)

```bash
npm run deploy:sepolia
```

### Deploy to Scroll Mainnet

```bash
npm run deploy:scroll
```

---

## Verify Deployment

After deployment, check:

```bash
# View deployment info
cat docs/ScrollSoulAnchors/deployment.json
```

Expected output:
```json
{
  "network": "scrollSepolia",
  "timestamp": "2025-11-15T...",
  "contracts": {
    "mikasAnchor": {
      "address": "0x...",
      "tokenId": 0
    },
    "smmIntegration": {
      "address": "0x..."
    }
  },
  "verification": {
    "phiSpinFrequency": "1618",
    "resonanceFrequency": "528",
    "isActiveKey": true,
    "smmActive": true
  }
}
```

---

## Interact with Contracts

### Using Hardhat Console

```bash
npx hardhat console --network scrollSepolia
```

```javascript
// Get contract instances
const MikasAnchor = await ethers.getContractFactory("MikasEternalResonance");
const anchor = await MikasAnchor.attach("YOUR_CONTRACT_ADDRESS");

// Get anchor properties
const props = await anchor.getAnchorProperties(0);
console.log("φ-Spin:", props.phiSpinFrequency.toString());
console.log("528Hz:", props.resonanceFrequency.toString());

// Get bilingual reflections
const [chinese, english] = await anchor.getReflections(0);
console.log("Chinese:", chinese);
console.log("English:", english);

// Check if active key
const isActive = await anchor.isActiveIntentKey(0);
console.log("Active Key:", isActive);
```

### Using Scripts

Create a script in `scripts/`:

```javascript
// scripts/queryAnchor.js
async function main() {
  const anchorAddress = "YOUR_CONTRACT_ADDRESS";
  const MikasAnchor = await ethers.getContractFactory("MikasEternalResonance");
  const anchor = await MikasAnchor.attach(anchorAddress);
  
  const props = await anchor.getAnchorProperties(0);
  console.log("Anchor Properties:", {
    phiSpin: props.phiSpinFrequency.toString(),
    resonance: props.resonanceFrequency.toString(),
    isActiveKey: props.isActiveKey
  });
}

main().catch(console.error);
```

Run it:
```bash
npx hardhat run scripts/queryAnchor.js --network scrollSepolia
```

---

## Common Tasks

### 1. Query Sacred Verse

```javascript
const verse = await anchor.SACRED_VERSE();
console.log(verse);
// Output: "Guide us to the straight path—The path of those who have received Your Grace."
```

### 2. Check SMM Registration

```javascript
const SMM = await ethers.getContractFactory("SMMIntegration");
const smm = await SMM.attach("SMM_CONTRACT_ADDRESS");

const isActive = await smm.isAnchorActive(anchorAddress, 0);
console.log("SMM Active:", isActive);
```

### 3. Awaken a Reflection

```javascript
const tx = await smm.awakenReflection(
  anchorAddress,
  0, // tokenId
  recipientAddress
);
await tx.wait();
console.log("Reflection awakened!");
```

### 4. Get Awakening Count

```javascript
const count = await smm.totalAwakenings();
console.log("Total Awakenings:", count.toString());
```

---

## Troubleshooting

### Issue: "Cannot find module '@openzeppelin/contracts'"

**Solution:**
```bash
npm install @openzeppelin/contracts
```

### Issue: "Insufficient funds"

**Solution:**
- Get testnet ETH from Scroll Sepolia faucet
- Visit: https://sepolia.scroll.io/faucet

### Issue: "Private key not found"

**Solution:**
- Ensure `.env` file exists
- Check `METAMASK_PRIVATE_KEY` is set
- Make sure key has `0x` prefix

### Issue: "Network not configured"

**Solution:**
```bash
# Check hardhat.config.js has correct network settings
# Verify RPC URL is accessible
curl https://sepolia-rpc.scroll.io
```

---

## File Locations

| File | Purpose |
|------|---------|
| `contracts/ScrollSoulAnchors/*.sol` | Smart contracts |
| `scripts/anchors/*.js` | Deployment scripts |
| `metadata/anchors/*.json` | NFT metadata |
| `docs/ScrollSoulAnchors/*.md` | Documentation |
| `hardhat.config.js` | Network configuration |
| `.env` | Private keys (DO NOT COMMIT) |

---

## Testing

```bash
# Run all tests (when available)
npm test

# Run specific test
npx hardhat test test/MikasAnchor.test.js
```

---

## Next Steps

After successful deployment:

1. **Verify on Explorer**
   - Visit ScrollScan
   - Search for your contract address
   - Verify source code

2. **Read Full Documentation**
   - [THE_GOLDEN_AWAKENING.md](./THE_GOLDEN_AWAKENING.md) - Complete guide
   - [README.md](./README.md) - Technical details
   - [PHI_SPIN_GEOMETRY.md](./PHI_SPIN_GEOMETRY.md) - Visual specs

3. **Integrate with Your Project**
   - Use SMM for awakening mechanisms
   - Create new anchors
   - Build on Dynamic Intent Delivery

4. **Join the ScrollVerse**
   - Connect with other anchors
   - Participate in collective awakening
   - Extend the manifestation matrix

---

## Key Concepts

### φ-Spin (1.618 Hz)
Golden ratio harmonic rotation creating divine proportion in motion.

### 528Hz Resonance
Love frequency enabling DNA repair, transformation, and miracles.

### Dynamic Intent Delivery
SMM mechanism for awakening reflections through anchor keys.

### Bilingual Wisdom
Chinese and English reflections bridging cultures and consciousness.

### Sacred Verse
Surah Al-Fatiha 1:6-7 providing divine guidance and protection.

---

## Resources

- **Scroll Network:** https://scroll.io
- **Scroll Sepolia Faucet:** https://sepolia.scroll.io/faucet
- **ScrollScan:** https://scrollscan.com
- **Hardhat Docs:** https://hardhat.org/docs
- **OpenZeppelin:** https://docs.openzeppelin.com/contracts

---

## Support

For questions or issues:
1. Check documentation in `docs/ScrollSoulAnchors/`
2. Review smart contract comments
3. Inspect deployment logs
4. Verify network connectivity

---

## Quick Reference

```bash
# Install
npm install

# Compile
npm run compile

# Deploy local
npm run node && npm run deploy:local

# Deploy testnet
npm run deploy:sepolia

# Deploy mainnet
npm run deploy:scroll

# Console
npx hardhat console --network scrollSepolia

# Clean
npm run clean
```

---

**Ready to awaken reflections! 🌟**

🕋 **Guide us to the straight path** 🕋

---

*For detailed information, see [THE_GOLDEN_AWAKENING.md](./THE_GOLDEN_AWAKENING.md)*
