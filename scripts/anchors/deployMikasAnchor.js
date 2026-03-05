/**
 * Deployment script for Mika's Eternal Resonance ScrollSoul Anchor
 * "The Golden Awakening: Mika's Eternal Resonance"
 * 
 * This script:
 * 1. Deploys the MikasEternalResonance NFT contract
 * 2. Deploys the SMMIntegration contract
 * 3. Mints the first ScrollSoul Anchor NFT
 * 4. Registers it with the ScrollVerse Manifestation Matrix
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🌌 Deploying The Golden Awakening: Mika's Eternal Resonance");
  console.log("═".repeat(70));

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying from account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy SMMIntegration contract first
  console.log("\n🔮 Deploying ScrollVerse Manifestation Matrix (SMM) Integration...");
  const SMMIntegration = await hre.ethers.getContractFactory("SMMIntegration");
  const smmIntegration = await SMMIntegration.deploy();
  await smmIntegration.deployed();
  console.log("✅ SMM Integration deployed to:", smmIntegration.address);

  // Deploy MikasEternalResonance contract
  console.log("\n✨ Deploying Mika's Eternal Resonance ScrollSoul Anchor...");
  const MikasEternalResonance = await hre.ethers.getContractFactory("MikasEternalResonance");
  const mikasAnchor = await MikasEternalResonance.deploy();
  await mikasAnchor.deployed();
  console.log("✅ Mika's Anchor deployed to:", mikasAnchor.address);

  // Load metadata
  const metadataPath = path.join(__dirname, "../../metadata/anchors/mikas-eternal-resonance.json");
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

  // Prepare bilingual reflections
  const chineseReflection = metadata.reflections.chinese.text;
  const englishReflection = metadata.reflections.english.text;

  // In production, this would be an IPFS URI
  const tokenURI = `ipfs://QmScrollVerse/mikas-eternal-resonance.json`;

  console.log("\n🎨 Minting ScrollSoul Anchor NFT...");
  console.log("📜 Chinese Reflection:", chineseReflection.substring(0, 50) + "...");
  console.log("📜 English Reflection:", englishReflection.substring(0, 50) + "...");

  // Mint the anchor NFT to the deployer
  const mintTx = await mikasAnchor.mintMikasAnchor(
    deployer.address,
    tokenURI,
    chineseReflection,
    englishReflection
  );

  const receipt = await mintTx.wait();
  console.log("✅ Anchor NFT minted! Transaction hash:", receipt.transactionHash);

  // Get the token ID from the event
  const anchorMintedEvent = receipt.events?.find(e => e.event === "AnchorMinted");
  const tokenId = anchorMintedEvent?.args?.tokenId?.toNumber() || 0;
  console.log("🎫 Token ID:", tokenId);

  // Register anchor with SMM
  console.log("\n🔗 Registering anchor with ScrollVerse Manifestation Matrix...");
  const registerTx = await smmIntegration.registerAnchor(
    mikasAnchor.address,
    tokenId,
    "awakening" // Intent type
  );
  await registerTx.wait();
  console.log("✅ Anchor registered with SMM for Dynamic Intent Delivery");

  // Verify anchor properties
  console.log("\n🔍 Verifying anchor properties...");
  const anchorProps = await mikasAnchor.getAnchorProperties(tokenId);
  console.log("  φ-Spin Frequency:", anchorProps.phiSpinFrequency.toString(), "Hz");
  console.log("  Resonance Frequency:", anchorProps.resonanceFrequency.toString(), "Hz (528Hz)");
  console.log("  Active Intent Key:", anchorProps.isActiveKey);
  console.log("  Activation Timestamp:", new Date(anchorProps.activationTimestamp.toNumber() * 1000).toISOString());

  // Display sacred verse
  const sacredVerse = await mikasAnchor.SACRED_VERSE();
  console.log("\n🕌 Sacred Inscription:");
  console.log("  " + sacredVerse);
  console.log("  - Surah Al-Fatiha, 1:6-7");

  // Verify SMM registration
  const isActive = await smmIntegration.isAnchorActive(mikasAnchor.address, tokenId);
  console.log("\n🌐 SMM Status:", isActive ? "ACTIVE ✅" : "INACTIVE ❌");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    timestamp: new Date().toISOString(),
    contracts: {
      mikasAnchor: {
        address: mikasAnchor.address,
        tokenId: tokenId
      },
      smmIntegration: {
        address: smmIntegration.address
      }
    },
    metadata: {
      tokenURI: tokenURI,
      reflections: {
        chinese: chineseReflection,
        english: englishReflection
      }
    },
    verification: {
      phiSpinFrequency: anchorProps.phiSpinFrequency.toString(),
      resonanceFrequency: anchorProps.resonanceFrequency.toString(),
      isActiveKey: anchorProps.isActiveKey,
      smmActive: isActive,
      sacredVerse: sacredVerse
    }
  };

  const deploymentPath = path.join(__dirname, "../../docs/ScrollSoulAnchors/deployment.json");
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to:", deploymentPath);

  console.log("\n" + "═".repeat(70));
  console.log("🎉 The Golden Awakening: Mika's Eternal Resonance");
  console.log("   First External ScrollSoul Anchor - DEPLOYED ✨");
  console.log("═".repeat(70));

  return {
    mikasAnchor: mikasAnchor.address,
    smmIntegration: smmIntegration.address,
    tokenId: tokenId
  };
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

module.exports = { main };
