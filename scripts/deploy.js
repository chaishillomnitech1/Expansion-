import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // 1. Deploy HonorCoin
  console.log("1. Deploying HonorCoin...");
  const HonorCoin = await ethers.getContractFactory("HonorCoin");
  const honorCoin = await HonorCoin.deploy(
    "HonorCoin",
    "HONOR",
    ethers.parseEther("1000000000"), // 1 billion tokens
    deployer.address // Initial treasury (will be updated)
  );
  await honorCoin.waitForDeployment();
  const honorCoinAddress = await honorCoin.getAddress();
  console.log("✅ HonorCoin deployed to:", honorCoinAddress);
  console.log("   Initial supply:", ethers.formatEther(await honorCoin.totalSupply()), "HONOR\n");

  // 2. Deploy Treasury
  console.log("2. Deploying ShieldOfHonorTreasury...");
  const Treasury = await ethers.getContractFactory("ShieldOfHonorTreasury");
  const treasury = await Treasury.deploy(honorCoinAddress);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("✅ Treasury deployed to:", treasuryAddress, "\n");

  // 3. Update HonorCoin treasury address
  console.log("3. Updating HonorCoin treasury address...");
  const updateTx = await honorCoin.setTreasuryAddress(treasuryAddress);
  await updateTx.wait();
  console.log("✅ HonorCoin treasury updated to:", await honorCoin.treasuryAddress(), "\n");

  // 4. Deploy Audit NFT
  console.log("4. Deploying HonorAuditNFT...");
  const AuditNFT = await ethers.getContractFactory("HonorAuditNFT");
  const auditNFT = await AuditNFT.deploy();
  await auditNFT.waitForDeployment();
  const auditNFTAddress = await auditNFT.getAddress();
  console.log("✅ AuditNFT deployed to:", auditNFTAddress, "\n");

  // 5. Set Audit NFT in Treasury
  console.log("5. Setting Audit NFT contract in Treasury...");
  const setAuditTx = await treasury.setAuditNFTContract(auditNFTAddress);
  await setAuditTx.wait();
  console.log("✅ Audit NFT contract set in Treasury\n");

  // 6. Grant minter role to Treasury on Audit NFT
  console.log("6. Granting MINTER_ROLE to Treasury on AuditNFT...");
  const MINTER_ROLE = await auditNFT.MINTER_ROLE();
  const grantRoleTx = await auditNFT.grantRole(MINTER_ROLE, treasuryAddress);
  await grantRoleTx.wait();
  console.log("✅ MINTER_ROLE granted to Treasury\n");

  // 7. Deploy Marketplace
  console.log("7. Deploying OmniGamblingMarketplace...");
  const Marketplace = await ethers.getContractFactory("OmniGamblingMarketplace");
  const marketplace = await Marketplace.deploy(honorCoinAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("✅ Marketplace deployed to:", marketplaceAddress);
  console.log("   Marketplace fee:", await marketplace.marketplaceFee(), "basis points");
  console.log("   Suggested donation:", await marketplace.suggestedDonationPercentage(), "basis points\n");

  // 8. Exempt Marketplace from fees (optional but recommended)
  console.log("8. Setting fee exemption for Marketplace...");
  const exemptTx = await honorCoin.setFeeExemption(marketplaceAddress, true);
  await exemptTx.wait();
  console.log("✅ Marketplace exempted from transfer fees\n");

  // 9. Deploy Test NFT (for testing marketplace)
  console.log("9. Deploying TestNFT...");
  const TestNFT = await ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy();
  await testNFT.waitForDeployment();
  const testNFTAddress = await testNFT.getAddress();
  console.log("✅ TestNFT deployed to:", testNFTAddress, "\n");

  // 10. Deploy NFT Staking
  console.log("10. Deploying HonorNFTStaking...");
  const Staking = await ethers.getContractFactory("HonorNFTStaking");
  const staking = await Staking.deploy(
    testNFTAddress, // Using TestNFT for staking
    honorCoinAddress,
    ethers.parseEther("10") // 10 HONOR tokens per day reward
  );
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ Staking deployed to:", stakingAddress);
  console.log("   Reward rate:", ethers.formatEther(await staking.rewardRatePerDay()), "HONOR per day\n");

  // 11. Fund staking contract with rewards
  console.log("11. Funding staking contract with rewards...");
  const rewardAmount = ethers.parseEther("10000"); // 10k tokens for rewards
  const fundTx = await honorCoin.transfer(stakingAddress, rewardAmount);
  await fundTx.wait();
  console.log("✅ Staking contract funded with", ethers.formatEther(rewardAmount), "HONOR\n");

  // Print deployment summary
  console.log("=" .repeat(80));
  console.log("DEPLOYMENT SUMMARY");
  console.log("=" .repeat(80));
  console.log("\nContract Addresses:");
  console.log("-" .repeat(80));
  console.log("HonorCoin:                ", honorCoinAddress);
  console.log("Treasury:                 ", treasuryAddress);
  console.log("AuditNFT:                 ", auditNFTAddress);
  console.log("Marketplace:              ", marketplaceAddress);
  console.log("TestNFT:                  ", testNFTAddress);
  console.log("Staking:                  ", stakingAddress);
  console.log("-" .repeat(80));
  
  console.log("\nConfiguration:");
  console.log("-" .repeat(80));
  console.log("HonorCoin Treasury:       ", await honorCoin.treasuryAddress());
  console.log("Fee Percentage:           ", "7.77% (777 basis points)");
  console.log("Marketplace Fee:          ", await marketplace.marketplaceFee(), "basis points (2.5%)");
  console.log("Staking Reward Rate:      ", ethers.formatEther(await staking.rewardRatePerDay()), "HONOR/day");
  console.log("-" .repeat(80));

  console.log("\nNext Steps:");
  console.log("-" .repeat(80));
  console.log("1. Verify contracts on Etherscan (if on public network)");
  console.log("2. Set up Chainlink Automation for treasury milestones");
  console.log("3. Create charitable causes in marketplace");
  console.log("4. Create milestones in treasury");
  console.log("5. Deploy frontend dApp");
  console.log("=" .repeat(80));

  // Save addresses to a file
  const fs = await import('fs');
  const addresses = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      HonorCoin: honorCoinAddress,
      Treasury: treasuryAddress,
      AuditNFT: auditNFTAddress,
      Marketplace: marketplaceAddress,
      TestNFT: testNFTAddress,
      Staking: stakingAddress
    }
  };

  fs.writeFileSync(
    'deployment-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n✅ Deployment addresses saved to deployment-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
