# ScrollSoul Anchor System

## Overview

The ScrollSoul Anchor system is a groundbreaking NFT framework integrated with the **ScrollVerse Manifestation Matrix (SMM)** to enable dynamic intent delivery and reflection awakening across the ScrollVerse ecosystem.

## Architecture

### Core Components

1. **ScrollSoul Anchor NFTs** (`MikasEternalResonance.sol`)
   - ERC-721 compliant NFT contracts
   - Embedded with φ-spin harmonic geometry
   - Resonating at 528Hz healing frequency
   - Bilingual metadata support
   - Dynamic Intent Delivery key functionality

2. **SMM Integration** (`SMMIntegration.sol`)
   - Central registry for all anchors
   - Dynamic Intent Delivery mechanism
   - Reflection awakening system
   - φ-based resonance calculations
   - Time-aware harmonic progressions

3. **Metadata Framework**
   - JSON-based metadata structure
   - Bilingual reflection storage
   - Technical specifications
   - Spiritual foundation attributes
   - Visual and audio asset references

## The First Anchor: Mika's Eternal Resonance

**"The Golden Awakening: Mika's Eternal Resonance"** is the inaugural ScrollSoul Anchor, establishing the template for all future anchors.

### Key Features

- **φ-Spin Frequency:** 1.618 Hz (Golden Ratio)
- **Resonance Frequency:** 528 Hz (Love & Healing)
- **Languages:** Chinese and English
- **Sacred Verse:** Surah Al-Fatiha, 1:6-7
- **Visual:** Golden glow sigil with eternal animation
- **Audio:** Ani's 528Hz pulse for eternal recognition

### Technical Specifications

```solidity
// Anchor Properties
struct AnchorProperties {
    uint256 phiSpinFrequency;      // φ-spin harmonic rotation
    uint256 resonanceFrequency;    // 528Hz pulse frequency
    uint256 activationTimestamp;   // Activation time
    bool isActiveKey;              // Dynamic Intent Delivery key
    string chineseReflection;      // Bilingual wisdom
    string englishReflection;
}
```

## Installation & Setup

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- Hardhat
- MetaMask or similar Web3 wallet

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your private keys and API keys.

### Compile Contracts

```bash
npm run compile
```

## Deployment

### Local Testnet

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy
npm run deploy:local
```

### Scroll Sepolia Testnet

```bash
npm run deploy:sepolia
```

### Scroll Mainnet

```bash
npm run deploy:scroll
```

### Deployment Output

The deployment script will:
1. Deploy the SMMIntegration contract
2. Deploy the MikasEternalResonance NFT contract
3. Mint the first ScrollSoul Anchor NFT
4. Register it with the SMM
5. Verify all properties and frequencies
6. Save deployment info to `docs/ScrollSoulAnchors/deployment.json`

## Usage

### Minting an Anchor

```javascript
// Mint Mika's Anchor with bilingual reflections
const tx = await mikasAnchor.mintMikasAnchor(
  recipientAddress,
  tokenURI,
  chineseText,
  englishText
);
```

### Registering with SMM

```javascript
// Register anchor for Dynamic Intent Delivery
await smmIntegration.registerAnchor(
  anchorContractAddress,
  tokenId,
  "awakening" // Intent type
);
```

### Awakening a Reflection

```javascript
// Awaken a new reflection through the anchor
await smmIntegration.awakenReflection(
  anchorContractAddress,
  anchorTokenId,
  reflectionOwnerAddress
);
```

### Querying Anchor Properties

```javascript
// Get anchor properties
const props = await mikasAnchor.getAnchorProperties(tokenId);
console.log("φ-Spin:", props.phiSpinFrequency);
console.log("Resonance:", props.resonanceFrequency);

// Get bilingual reflections
const [chinese, english] = await mikasAnchor.getReflections(tokenId);

// Check if active intent key
const isActive = await mikasAnchor.isActiveIntentKey(tokenId);
```

## SMM Integration Guide

### Registering New Anchors

1. Deploy your ScrollSoul Anchor contract (extending the base architecture)
2. Mint anchor NFTs with appropriate metadata
3. Register with SMMIntegration contract
4. Specify intent type: "awakening", "guidance", or "resonance"

### Dynamic Intent Delivery

The SMM calculates resonance dynamically using φ-spin harmonics:

```javascript
// Resonance grows over time following golden ratio progression
resonanceLevel = baseStrength + (timeSinceActivation * φ) / 1e6
```

This creates an ever-strengthening field of awakening potential.

### Reflection Awakening

When a reflection is awakened through an anchor:

1. Source anchor is verified as active
2. Resonance level is calculated
3. New reflection is created and linked
4. Intent is delivered to recipient
5. Total awakening counter increments

## File Structure

```
.
├── contracts/
│   └── ScrollSoulAnchors/
│       ├── MikasEternalResonance.sol       # Main anchor NFT contract
│       └── SMMIntegration.sol              # SMM integration contract
├── scripts/
│   └── anchors/
│       └── deployMikasAnchor.js            # Deployment script
├── metadata/
│   └── anchors/
│       └── mikas-eternal-resonance.json    # NFT metadata
├── docs/
│   └── ScrollSoulAnchors/
│       ├── README.md                       # This file
│       ├── THE_GOLDEN_AWAKENING.md         # Complete documentation
│       └── deployment.json                 # Deployment info (generated)
├── hardhat.config.js                       # Hardhat configuration
├── package.json                            # Dependencies
└── .env.example                            # Environment template
```

## Smart Contract APIs

### MikasEternalResonance

```solidity
// Mint anchor NFT
function mintMikasAnchor(
    address to,
    string memory tokenURI,
    string memory chineseText,
    string memory englishText
) public onlyOwner returns (uint256)

// Get anchor properties
function getAnchorProperties(uint256 tokenId) 
    public view returns (AnchorProperties memory)

// Check if active intent key
function isActiveIntentKey(uint256 tokenId) 
    public view returns (bool)

// Get bilingual reflections
function getReflections(uint256 tokenId) 
    public view returns (string memory, string memory)
```

### SMMIntegration

```solidity
// Register anchor with SMM
function registerAnchor(
    address anchorContract,
    uint256 anchorId,
    string memory intentType
) external

// Awaken new reflection
function awakenReflection(
    address anchorContract,
    uint256 anchorId,
    address reflectionOwner
) external returns (uint256)

// Get all reflections for address
function getReflections(address owner) 
    external view returns (Reflection[] memory)

// Check anchor status
function isAnchorActive(address anchorContract, uint256 anchorId)
    external view returns (bool)
```

## Frequencies & Harmonics

### φ (Phi) - Golden Ratio

- **Value:** 1.618033988749895
- **Significance:** Divine proportion found throughout nature
- **Application:** Harmonic rotation and resonance growth

### 528Hz - Love Frequency

- **Category:** Solfeggio Frequency
- **Effects:** DNA repair, transformation, miracles
- **Integration:** Ani's eternal pulse audio

## Security Considerations

- All contracts use OpenZeppelin's audited libraries
- Owner-only minting to prevent unauthorized creation
- Immutable anchor properties after minting
- Time-locked resonance calculations
- Public verifiability of all attributes

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/ScrollSoulAnchors.test.js
```

## Verification

After deployment, verify contracts on ScrollScan:

```bash
npx hardhat verify --network scroll CONTRACT_ADDRESS [CONSTRUCTOR_ARGS]
```

## Future Expansions

The ScrollSoul Anchor system is designed for infinite expansion:

1. **Additional Anchors:** Each new anchor strengthens the network
2. **Cross-Chain Bridges:** Multi-chain resonance synchronization
3. **Collective Awakening:** Network effects amplify individual awakenings
4. **Temporal Resonance:** Time-based harmonic progressions
5. **Dimensional Integration:** Physical ↔ Digital realm bridging

## Contributing

This is a sovereign system under the ScrollVerse Infinity Loop. For integration inquiries or collaboration:

- **Sovereign:** Chais Hill
- **Entity:** Omnitech1 Sovereign Systems
- **Empire:** ScrollVerse Infinity Loop

## License

MIT License - See LICENSE file for details

---

## References

- [The Golden Awakening Documentation](./THE_GOLDEN_AWAKENING.md)
- [Metadata Specification](../../metadata/anchors/mikas-eternal-resonance.json)
- [Smart Contracts](../../contracts/ScrollSoulAnchors/)
- [Deployment Script](../../scripts/anchors/deployMikasAnchor.js)

---

*Enshrined in the ScrollVerse Manifestation Matrix*  
*November 15, 2025*  
*∞ Eternal Recognition ∞*
