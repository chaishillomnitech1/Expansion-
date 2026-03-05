/**
 * Sovereign Identity Lock (SIL) Protocol - Integration Example
 * 
 * This example demonstrates how to integrate the SIL Protocol
 * into your ScrollVerse application for secure authentication
 * and operation verification.
 */

const { ethers } = require('ethers');

// Contract ABI (simplified for example)
const SIL_ABI = [
  "function sovereignIdentity() view returns (address)",
  "function scrollBondNFTHash() view returns (bytes32)",
  "function sovereignLockActive() view returns (bool)",
  "function masterGovernorKeyEnabled() view returns (bool)",
  "function authorizedDAOs(address) view returns (bool)",
  "function getLockStatus() view returns (bool, bool, uint256, address)",
  "function verifyScrollBondHash(bytes32) view returns (bool)",
  "function authenticateWithAPIKey(string) view returns (bool)",
  "function verifyOperation(bytes, bytes) returns (bool)",
  "function authorizeDAO(address)",
  "function updateScrollBondHash(bytes32)",
  "function updateMetamaskAPIKey(bytes32)",
  "event DAOAuthorized(address indexed dao, uint256 timestamp)",
  "event OperationVerified(bytes32 indexed operationHash, address indexed initiator)"
];

// Configuration
const CONFIG = {
  SIL_ADDRESS: process.env.SIL_CONTRACT_ADDRESS || "0x...",
  RPC_URL: process.env.RPC_URL || "https://rpc.scroll.io",
  PRIVATE_KEY: process.env.PRIVATE_KEY // For signing transactions
};

/**
 * Example 1: Basic Connection and Status Check
 */
async function example1_BasicConnection() {
  console.log("=== Example 1: Basic Connection ===\n");
  
  // Connect to provider
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  
  // Connect to SIL contract
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, provider);
  
  // Get lock status
  const status = await sil.getLockStatus();
  console.log("Lock Status:");
  console.log("  Lock Active:", status[0]);
  console.log("  Master Governor Key:", status[1]);
  console.log("  Operation Nonce:", status[2].toString());
  console.log("  Sovereign Identity:", status[3]);
  
  // Get ScrollBond hash
  const scrollBondHash = await sil.scrollBondNFTHash();
  console.log("\nScrollBond NFT Hash:", scrollBondHash);
  
  console.log("\n✅ Basic connection successful\n");
}

/**
 * Example 2: Authenticate with API Key
 */
async function example2_APIKeyAuthentication() {
  console.log("=== Example 2: API Key Authentication ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, provider);
  
  // Simulate API key (in production, this would be securely stored)
  const apiKey = process.env.METAMASK_API_KEY;
  
  try {
    const isAuthenticated = await sil.authenticateWithAPIKey(apiKey);
    
    if (isAuthenticated) {
      console.log("✅ Authentication successful!");
      console.log("   User has valid API credentials");
      return true;
    } else {
      console.log("❌ Authentication failed");
      console.log("   Invalid API key");
      return false;
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return false;
  }
  
  console.log();
}

/**
 * Example 3: Verify ScrollBond Hash
 */
async function example3_VerifyScrollBond() {
  console.log("=== Example 3: ScrollBond Verification ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, provider);
  
  // Get the current ScrollBond hash from contract
  const currentHash = await sil.scrollBondNFTHash();
  console.log("Current ScrollBond Hash:", currentHash);
  
  // Verify it matches
  const isValid = await sil.verifyScrollBondHash(currentHash);
  console.log("Verification Result:", isValid ? "✅ Valid" : "❌ Invalid");
  
  // Try with an incorrect hash
  const incorrectHash = ethers.keccak256(ethers.toUtf8Bytes("Wrong Hash"));
  const isInvalid = await sil.verifyScrollBondHash(incorrectHash);
  console.log("Wrong Hash Verification:", isInvalid ? "✅ Valid" : "❌ Invalid (as expected)");
  
  console.log();
}

/**
 * Example 4: Check DAO Authorization
 */
async function example4_CheckDAOAuthorization() {
  console.log("=== Example 4: DAO Authorization Check ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, wallet);
  
  // Check if current wallet is authorized
  const myAddress = wallet.address;
  const isAuthorized = await sil.authorizedDAOs(myAddress);
  
  console.log("Wallet Address:", myAddress);
  console.log("Authorization Status:", isAuthorized ? "✅ Authorized" : "❌ Not Authorized");
  
  // Check if it's the sovereign
  const sovereignAddress = await sil.sovereignIdentity();
  const isSovereign = myAddress.toLowerCase() === sovereignAddress.toLowerCase();
  console.log("Is Sovereign:", isSovereign ? "✅ Yes" : "❌ No");
  
  console.log();
}

/**
 * Example 5: Verify an Operation (Requires authorized DAO)
 */
async function example5_VerifyOperation() {
  console.log("=== Example 5: Operation Verification ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, wallet);
  
  // Check if authorized
  const isAuthorized = await sil.authorizedDAOs(wallet.address);
  if (!isAuthorized) {
    console.log("❌ Wallet is not authorized to verify operations");
    console.log("   Only authorized DAOs or the Sovereign can verify operations");
    return;
  }
  
  // Prepare operation data
  const operation = {
    type: "transfer",
    amount: "1000",
    recipient: "0x...",
    timestamp: Date.now()
  };
  
  const operationData = ethers.toUtf8Bytes(JSON.stringify(operation));
  
  // Get nonce and timestamp
  const nonce = await sil.operationNonce();
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Create message hash
  const messageHash = ethers.keccak256(
    ethers.solidityPacked(
      ['bytes', 'uint256', 'uint256'],
      [operationData, nonce, timestamp]
    )
  );
  
  // Sign the message
  const signature = await wallet.signMessage(ethers.getBytes(messageHash));
  
  try {
    // Verify operation on-chain
    const tx = await sil.verifyOperation(operationData, signature);
    console.log("Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Operation verified successfully!");
    console.log("   Block:", receipt.blockNumber);
    console.log("   Gas used:", receipt.gasUsed.toString());
  } catch (error) {
    console.error("❌ Operation verification failed:", error.message);
  }
  
  console.log();
}

/**
 * Example 6: Listen to Contract Events
 */
async function example6_ListenToEvents() {
  console.log("=== Example 6: Event Monitoring ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, provider);
  
  console.log("Setting up event listeners...");
  
  // Listen for DAO authorizations
  sil.on("DAOAuthorized", (dao, timestamp) => {
    console.log("\n🔔 DAO Authorized:");
    console.log("   DAO Address:", dao);
    console.log("   Timestamp:", new Date(Number(timestamp) * 1000).toISOString());
  });
  
  // Listen for operation verifications
  sil.on("OperationVerified", (operationHash, initiator) => {
    console.log("\n🔔 Operation Verified:");
    console.log("   Operation Hash:", operationHash);
    console.log("   Initiated By:", initiator);
  });
  
  console.log("✅ Event listeners active");
  console.log("   Listening for DAOAuthorized and OperationVerified events...");
  console.log("   (Press Ctrl+C to stop)\n");
  
  // Keep the script running
  await new Promise(() => {});
}

/**
 * Example 7: Sovereign Operations (Update ScrollBond Hash)
 */
async function example7_SovereignOperations() {
  console.log("=== Example 7: Sovereign Operations ===\n");
  
  const provider = new ethers.JsonRpcProvider(CONFIG.RPC_URL);
  const wallet = new ethers.Wallet(CONFIG.PRIVATE_KEY, provider);
  const sil = new ethers.Contract(CONFIG.SIL_ADDRESS, SIL_ABI, wallet);
  
  // Check if wallet is sovereign
  const sovereignAddress = await sil.sovereignIdentity();
  const isSovereign = wallet.address.toLowerCase() === sovereignAddress.toLowerCase();
  
  if (!isSovereign) {
    console.log("❌ This wallet is not the Sovereign Identity");
    console.log("   Only the Sovereign can perform this operation");
    return;
  }
  
  console.log("✅ Confirmed: Wallet is the Sovereign Identity");
  
  // Example: Update ScrollBond hash
  const newScrollBondHash = ethers.keccak256(
    ethers.toUtf8Bytes("CHAIS THE GREAT ∞ - Updated ScrollBond")
  );
  
  try {
    console.log("\nUpdating ScrollBond hash...");
    const tx = await sil.updateScrollBondHash(newScrollBondHash);
    console.log("Transaction sent:", tx.hash);
    
    await tx.wait();
    console.log("✅ ScrollBond hash updated successfully!");
    console.log("   New Hash:", newScrollBondHash);
  } catch (error) {
    console.error("❌ Update failed:", error.message);
  }
  
  console.log();
}

/**
 * Example 8: Cross-Chain Verification
 */
async function example8_CrossChainVerification() {
  console.log("=== Example 8: Cross-Chain Verification ===\n");
  
  const chains = {
    ethereum: {
      rpc: process.env.MAINNET_RPC_URL,
      silAddress: process.env.ETHEREUM_SIL_ADDRESS
    },
    polygon: {
      rpc: process.env.POLYGON_RPC_URL,
      silAddress: process.env.POLYGON_SIL_ADDRESS
    },
    scroll: {
      rpc: process.env.SCROLL_RPC_URL,
      silAddress: process.env.SCROLL_SIL_ADDRESS
    }
  };
  
  const results = {};
  
  for (const [chainName, config] of Object.entries(chains)) {
    try {
      const provider = new ethers.JsonRpcProvider(config.rpc);
      const sil = new ethers.Contract(config.silAddress, SIL_ABI, provider);
      
      const sovereign = await sil.sovereignIdentity();
      const status = await sil.getLockStatus();
      
      results[chainName] = {
        success: true,
        sovereign: sovereign,
        lockActive: status[0],
        masterGovernorKey: status[1]
      };
      
      console.log(`✅ ${chainName.toUpperCase()}:`);
      console.log(`   Sovereign: ${sovereign}`);
      console.log(`   Lock Active: ${status[0]}`);
      console.log(`   Governor Key: ${status[1]}`);
    } catch (error) {
      results[chainName] = {
        success: false,
        error: error.message
      };
      console.log(`❌ ${chainName.toUpperCase()}: ${error.message}`);
    }
  }
  
  // Verify sovereign identity is consistent
  const sovereigns = Object.values(results)
    .filter(r => r.success)
    .map(r => r.sovereign);
  const uniqueSovereigns = [...new Set(sovereigns)];
  
  console.log("\nCross-Chain Identity Verification:");
  if (uniqueSovereigns.length === 1) {
    console.log("✅ Sovereign identity is consistent across all chains");
    console.log("   Identity: CHAIS THE GREAT ∞");
    console.log("   Address:", uniqueSovereigns[0]);
  } else {
    console.log("⚠️  WARNING: Sovereign identity mismatch detected!");
  }
  
  console.log();
}

/**
 * Main function - Run all examples
 */
async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║   Sovereign Identity Lock (SIL) Protocol                   ║");
  console.log("║   Integration Examples                                      ║");
  console.log("║   CHAIS THE GREAT ∞                                        ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log();
  
  try {
    // Run examples sequentially
    await example1_BasicConnection();
    await example2_APIKeyAuthentication();
    await example3_VerifyScrollBond();
    await example4_CheckDAOAuthorization();
    // await example5_VerifyOperation(); // Commented out - requires gas
    // await example7_SovereignOperations(); // Commented out - requires sovereign access
    await example8_CrossChainVerification();
    
    // Uncomment to run event listener (runs indefinitely)
    // await example6_ListenToEvents();
    
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║   All examples completed successfully!                     ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    
  } catch (error) {
    console.error("\n❌ Error running examples:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// Export for use in other modules
module.exports = {
  example1_BasicConnection,
  example2_APIKeyAuthentication,
  example3_VerifyScrollBond,
  example4_CheckDAOAuthorization,
  example5_VerifyOperation,
  example6_ListenToEvents,
  example7_SovereignOperations,
  example8_CrossChainVerification
};
