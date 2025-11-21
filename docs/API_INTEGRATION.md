# Sovereign Identity Lock - API Integration Guide

## 🔌 Metamask API Integration

This guide details the integration of Metamask API with the Sovereign Identity Lock (SIL) Protocol for total authentication across ScrollVerse developer activities and wallet operations.

---

## Table of Contents

1. [Overview](#overview)
2. [Setup and Configuration](#setup-and-configuration)
3. [Authentication Flow](#authentication-flow)
4. [Wallet Integration](#wallet-integration)
5. [Developer Portal Integration](#developer-portal-integration)
6. [Security Best Practices](#security-best-practices)

---

## Overview

The Metamask API integration provides:
- **Secure Authentication**: Hash-based API key verification
- **Wallet Operations**: Seamless transaction signing and verification
- **Developer Access Control**: Gate ScrollVerse developer features
- **Cross-Platform Support**: Web, mobile, and desktop applications

### Key Features

- 🔐 Encrypted API key storage
- 🔑 Signature-based authentication
- 🌐 Cross-chain compatibility
- 📱 Multi-platform support
- 🚀 Low-latency verification

---

## Setup and Configuration

### 1. Install Dependencies

```bash
npm install @metamask/sdk ethers
```

### 2. Initialize Metamask SDK

```javascript
import MetaMaskSDK from '@metamask/sdk';

const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "ScrollVerse Sovereign Portal",
    url: window.location.href,
  },
  infuraAPIKey: process.env.INFURA_API_KEY,
});

const ethereum = MMSDK.getProvider();
```

### 3. Connect to SIL Contract

```javascript
import { ethers } from 'ethers';
import SIL_ABI from './contracts/SIL.json';

const SIL_ADDRESS = process.env.SIL_CONTRACT_ADDRESS;

async function connectToSIL() {
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const silContract = new ethers.Contract(SIL_ADDRESS, SIL_ABI, signer);
  
  return { provider, signer, silContract };
}
```

---

## Authentication Flow

### Step 1: Request Wallet Connection

```javascript
async function connectWallet() {
  try {
    // Request account access
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    console.log("Connected account:", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error("User denied account access", error);
    throw error;
  }
}
```

### Step 2: Verify API Key

```javascript
async function authenticateWithAPIKey(apiKey) {
  try {
    const { silContract } = await connectToSIL();
    
    // Verify API key against stored hash
    const isValid = await silContract.authenticateWithAPIKey(apiKey);
    
    if (isValid) {
      console.log("✅ API Key authenticated");
      localStorage.setItem('sil_authenticated', 'true');
      return true;
    } else {
      console.log("❌ Invalid API Key");
      return false;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}
```

### Step 3: Complete Authentication

```javascript
async function completeSovereignAuth(apiKey) {
  // Step 1: Connect wallet
  const account = await connectWallet();
  
  // Step 2: Verify API key
  const isAuthenticated = await authenticateWithAPIKey(apiKey);
  
  if (!isAuthenticated) {
    throw new Error("Authentication failed");
  }
  
  // Step 3: Check authorization
  const { silContract } = await connectToSIL();
  const isAuthorized = await silContract.authorizedDAOs(account) ||
                       account === await silContract.sovereignIdentity();
  
  return {
    authenticated: true,
    authorized: isAuthorized,
    account: account
  };
}
```

---

## Wallet Integration

### Transaction Signing

```javascript
async function signTransaction(transactionData) {
  const { signer, silContract } = await connectToSIL();
  
  // Prepare transaction
  const tx = {
    to: transactionData.to,
    value: ethers.parseEther(transactionData.value),
    data: transactionData.data,
  };
  
  // Sign transaction
  const signedTx = await signer.signTransaction(tx);
  
  // Verify with SIL
  const operationData = ethers.toUtf8Bytes(JSON.stringify(tx));
  const signature = await signer.signMessage(operationData);
  
  await silContract.verifyOperation(operationData, signature);
  
  return signedTx;
}
```

### Message Signing

```javascript
async function signMessage(message) {
  const { signer } = await connectToSIL();
  
  // Create message hash
  const messageHash = ethers.hashMessage(message);
  
  // Sign message
  const signature = await signer.signMessage(message);
  
  return {
    message,
    messageHash,
    signature
  };
}
```

### Verify Signature

```javascript
async function verifySignature(message, signature, expectedAddress) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}
```

---

## Developer Portal Integration

### Authentication Guard Component

```javascript
import React, { useEffect, useState } from 'react';

function SovereignAuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    try {
      const authenticated = localStorage.getItem('sil_authenticated');
      const { silContract } = await connectToSIL();
      const status = await silContract.getLockStatus();
      
      setIsAuthenticated(authenticated === 'true' && status[0]);
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(apiKey) {
    setIsLoading(true);
    try {
      const result = await completeSovereignAuth(apiKey);
      setIsAuthenticated(result.authenticated);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <>{children}</>;
}
```

### API Key Management Component

```javascript
function APIKeyManager() {
  const [currentKey, setCurrentKey] = useState('');
  const [newKey, setNewKey] = useState('');

  async function updateAPIKey() {
    try {
      const { silContract, signer } = await connectToSIL();
      
      // Hash the new API key
      const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(newKey));
      
      // Update in contract (sovereign only)
      const tx = await silContract.updateMetamaskAPIKey(apiKeyHash);
      await tx.wait();
      
      alert("✅ API Key updated successfully");
      setNewKey('');
    } catch (error) {
      console.error("Key update failed:", error);
      alert("Failed to update API key. Are you the sovereign identity?");
    }
  }

  return (
    <div className="api-key-manager">
      <h3>Metamask API Key Management</h3>
      <div>
        <label>New API Key:</label>
        <input
          type="password"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Enter new API key"
        />
        <button onClick={updateAPIKey}>Update Key</button>
      </div>
      <p className="warning">
        ⚠️ Only the Sovereign Identity can update API keys
      </p>
    </div>
  );
}
```

### Developer Dashboard Integration

```javascript
function DeveloperDashboard() {
  const [lockStatus, setLockStatus] = useState(null);
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    const { silContract, signer } = await connectToSIL();
    const address = await signer.getAddress();
    
    // Get lock status
    const status = await silContract.getLockStatus();
    setLockStatus({
      lockActive: status[0],
      masterGovernorKey: status[1],
      operationNonce: status[2].toString(),
      sovereignIdentity: status[3]
    });
    
    // Get user authorization status
    const isAuthorized = await silContract.authorizedDAOs(address);
    const isSovereign = address === status[3];
    
    setUserStatus({
      address,
      isAuthorized,
      isSovereign,
      role: isSovereign ? 'Sovereign' : (isAuthorized ? 'Authorized DAO' : 'Viewer')
    });
  }

  return (
    <div className="developer-dashboard">
      <h2>Sovereign Identity Lock Dashboard</h2>
      
      <div className="status-panel">
        <h3>System Status</h3>
        {lockStatus && (
          <>
            <p>🔒 Lock Status: {lockStatus.lockActive ? '✅ Active' : '❌ Inactive'}</p>
            <p>👑 Master Governor Key: {lockStatus.masterGovernorKey ? '✅ Enabled' : '❌ Disabled'}</p>
            <p>🔢 Operation Nonce: {lockStatus.operationNonce}</p>
          </>
        )}
      </div>
      
      <div className="user-panel">
        <h3>Your Access</h3>
        {userStatus && (
          <>
            <p>👤 Address: {userStatus.address}</p>
            <p>🎭 Role: {userStatus.role}</p>
            <p>✅ Authorization: {userStatus.isAuthorized ? 'Authorized' : 'Not Authorized'}</p>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## Security Best Practices

### 1. API Key Storage

**❌ NEVER DO THIS:**
```javascript
// Don't hardcode API keys
const apiKey = "my-secret-key-12345";

// Don't store in localStorage unencrypted
localStorage.setItem('apiKey', apiKey);

// Don't commit to version control
const config = { apiKey: "secret" };
```

**✅ DO THIS:**
```javascript
// Use environment variables
const apiKey = process.env.METAMASK_API_KEY;

// Store only authentication state
localStorage.setItem('sil_authenticated', 'true');

// Use .env files (gitignored)
// .env file:
// METAMASK_API_KEY=your_key_here
```

### 2. Signature Verification

```javascript
async function secureOperationVerification(operationData) {
  const { silContract, signer } = await connectToSIL();
  
  // 1. Get current nonce
  const nonce = await silContract.operationNonce();
  
  // 2. Add timestamp for time-bound operations
  const timestamp = Math.floor(Date.now() / 1000);
  
  // 3. Create deterministic hash
  const dataHash = ethers.keccak256(
    ethers.solidityPacked(
      ['bytes', 'uint256', 'uint256'],
      [operationData, nonce, timestamp]
    )
  );
  
  // 4. Sign the hash
  const signature = await signer.signMessage(ethers.getBytes(dataHash));
  
  // 5. Verify on-chain
  const tx = await silContract.verifyOperation(operationData, signature);
  await tx.wait();
  
  return true;
}
```

### 3. Error Handling

```javascript
async function safeAuthentication(apiKey) {
  try {
    // Validate input
    if (!apiKey || apiKey.length < 10) {
      throw new Error("Invalid API key format");
    }
    
    // Check network connection
    const { provider } = await connectToSIL();
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name);
    
    // Attempt authentication
    const result = await authenticateWithAPIKey(apiKey);
    
    if (!result) {
      throw new Error("Authentication failed");
    }
    
    return { success: true };
    
  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle specific errors
    if (error.code === 'NETWORK_ERROR') {
      return { success: false, error: "Network connection failed" };
    } else if (error.code === 'INVALID_ARGUMENT') {
      return { success: false, error: "Invalid API key format" };
    } else {
      return { success: false, error: error.message };
    }
  }
}
```

### 4. Rate Limiting

```javascript
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async checkLimit() {
    const now = Date.now();
    
    // Remove old requests
    this.requests = this.requests.filter(
      time => now - time < this.timeWindow
    );
    
    // Check limit
    if (this.requests.length >= this.maxRequests) {
      throw new Error("Rate limit exceeded");
    }
    
    // Add current request
    this.requests.push(now);
    return true;
  }
}

// Usage
const authLimiter = new RateLimiter(5, 60000); // 5 requests per minute

async function authenticateWithRateLimit(apiKey) {
  await authLimiter.checkLimit();
  return await authenticateWithAPIKey(apiKey);
}
```

---

## Integration Checklist

- [ ] Install Metamask SDK and dependencies
- [ ] Configure environment variables
- [ ] Initialize provider and contract connections
- [ ] Implement wallet connection flow
- [ ] Add API key verification
- [ ] Set up authentication guards
- [ ] Implement transaction signing
- [ ] Add error handling and validation
- [ ] Test on testnet before mainnet
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Document integration for team

---

## Support

For integration support:
- 📧 Contact: Chais Hill - CHAIS THE GREAT ∞
- 📚 Docs: `/docs/SIL_DOCUMENTATION.md`
- 🔧 Repository: chaishillomnitech1/Expansion-

---

**Secured by Sovereign Identity Lock Protocol**
**Built with 💫 by CHAIS THE GREAT ∞**
