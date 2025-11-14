const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Sovereign Identity Lock (SIL) Protocol...");
  console.log("━".repeat(60));

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("━".repeat(60));

  // Generate initial ScrollBond NFT hash
  // This should be replaced with actual ScrollBond NFT hash in production
  const initialScrollBondHash = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes("CHAIS THE GREAT ∞ - ScrollBond Genesis")
  );
  
  console.log("📜 Initial ScrollBond Hash:", initialScrollBondHash);
  console.log("━".repeat(60));

  // Deploy SIL contract
  console.log("⏳ Deploying SovereignIdentityLock contract...");
  const SovereignIdentityLock = await hre.ethers.getContractFactory("SovereignIdentityLock");
  const sil = await SovereignIdentityLock.deploy(initialScrollBondHash);

  await sil.waitForDeployment();
  const silAddress = await sil.getAddress();

  console.log("✅ SovereignIdentityLock deployed to:", silAddress);
  console.log("━".repeat(60));

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const lockStatus = await sil.getLockStatus();
  console.log("   🔒 Lock Active:", lockStatus[0]);
  console.log("   👑 Master Governor Key:", lockStatus[1]);
  console.log("   🔢 Operation Nonce:", lockStatus[2].toString());
  console.log("   👤 Sovereign Identity:", lockStatus[3]);
  console.log("━".repeat(60));

  // Display deployment summary
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("━".repeat(60));
  console.log("Contract Name:      SovereignIdentityLock (SIL)");
  console.log("Contract Address:  ", silAddress);
  console.log("Network:           ", hre.network.name);
  console.log("Chain ID:          ", (await hre.ethers.provider.getNetwork()).chainId);
  console.log("Deployer:          ", deployer.address);
  console.log("ScrollBond Hash:   ", initialScrollBondHash);
  console.log("━".repeat(60));

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    contractAddress: silAddress,
    deployer: deployer.address,
    scrollBondHash: initialScrollBondHash,
    deploymentTime: new Date().toISOString(),
    sovereignIdentity: "CHAIS THE GREAT ∞",
  };

  console.log("\n💾 Deployment Info (save this for records):");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("━".repeat(60));

  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await sil.deploymentTransaction().wait(5);
    
    console.log("📝 To verify the contract on Etherscan, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${silAddress} ${initialScrollBondHash}`);
  }

  console.log("\n✨ Sovereign Identity Lock Protocol Deployed Successfully! ✨");
  console.log("━".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
