# API Reference - Inter-Realm Architecture

**Version:** 1.0.0  
**Author:** Chais Hill | Omnitech1  
**Last Updated:** 2025-11-14

## Overview

This document provides a comprehensive API reference for all smart contracts in the Inter-Realm Architecture.

## Table of Contents

1. [InterRealmAssetRegistry](#interrealmassetregistry)
2. [InterRealmBridge](#interrealmbridge)
3. [ZKRollupVerifier](#zkrollupverifier)
4. [RealmGovernance](#realmgovernance)

---

## InterRealmAssetRegistry

Contract for tracking digital assets across realms and galaxies.

### State Variables

```solidity
mapping(uint256 => Asset) public assets;
mapping(uint256 => Realm) public realms;
mapping(address => uint256[]) public ownerAssets;
uint256 public assetCounter;
uint256 public realmCounter;
address public admin;
```

### Structures

#### Asset
```solidity
struct Asset {
    uint256 assetId;
    address owner;
    uint256 realmId;
    uint256 galaxyId;
    bytes32 assetHash;
    uint256 value;
    bool isLocked;
    uint256 timestamp;
}
```

#### Realm
```solidity
struct Realm {
    uint256 realmId;
    string name;
    bool isActive;
    address verifier;
}
```

### Functions

#### registerRealm
```solidity
function registerRealm(string memory _name, address _verifier) 
    external 
    onlyAdmin 
    returns (uint256)
```

Register a new realm in the system.

**Parameters:**
- `_name`: Name of the realm
- `_verifier`: Address of the realm verifier

**Returns:** 
- `uint256`: The ID of the newly registered realm

**Events Emitted:**
- `RealmRegistered(uint256 realmId, string name, address verifier)`

**Example:**
```javascript
const tx = await registry.registerRealm("Ethereum Realm", "0xVerifierAddress");
const receipt = await tx.wait();
const realmId = receipt.events[0].args.realmId;
```

---

#### registerAsset
```solidity
function registerAsset(
    uint256 _realmId,
    uint256 _galaxyId,
    bytes32 _assetHash,
    uint256 _value
) external returns (uint256)
```

Register a new asset in a specific realm.

**Parameters:**
- `_realmId`: ID of the realm where asset resides
- `_galaxyId`: ID of the galaxy (for intergalactic tracking)
- `_assetHash`: Unique hash identifying the asset
- `_value`: Value of the asset

**Returns:**
- `uint256`: The ID of the newly registered asset

**Events Emitted:**
- `AssetRegistered(uint256 assetId, address owner, uint256 realmId, uint256 galaxyId)`

**Requirements:**
- Realm must be active
- Caller becomes the asset owner

**Example:**
```javascript
const assetHash = ethers.utils.formatBytes32String("MyUniqueAsset");
const value = ethers.utils.parseEther("1.0");
const tx = await registry.registerAsset(1, 1, assetHash, value);
```

---

#### lockAsset
```solidity
function lockAsset(uint256 _assetId, uint256 _destinationRealmId) 
    external 
    onlyAssetOwner(_assetId) 
    assetNotLocked(_assetId)
```

Lock an asset for cross-realm transfer.

**Parameters:**
- `_assetId`: ID of the asset to lock
- `_destinationRealmId`: Destination realm ID

**Events Emitted:**
- `AssetLocked(uint256 assetId, uint256 destinationRealmId)`

**Requirements:**
- Caller must be asset owner
- Asset must not already be locked
- Destination realm must be active

---

#### unlockAsset
```solidity
function unlockAsset(uint256 _assetId, address _newOwner, uint256 _sourceRealmId) 
    external 
    onlyAdmin
```

Unlock an asset after transfer completion.

**Parameters:**
- `_assetId`: ID of the asset to unlock
- `_newOwner`: New owner address
- `_sourceRealmId`: Realm ID where asset is unlocked

**Events Emitted:**
- `AssetUnlocked(uint256 assetId, uint256 sourceRealmId)`
- `AssetTransferred(uint256 assetId, address from, address to, uint256 realmId)`

**Requirements:**
- Asset must be locked
- Only admin can call

---

#### getAsset
```solidity
function getAsset(uint256 _assetId) external view returns (Asset memory)
```

Get complete asset information.

**Parameters:**
- `_assetId`: ID of the asset

**Returns:**
- `Asset`: Complete asset struct

---

#### getOwnerAssets
```solidity
function getOwnerAssets(address _owner) external view returns (uint256[] memory)
```

Get all asset IDs owned by an address.

**Parameters:**
- `_owner`: Owner address

**Returns:**
- `uint256[]`: Array of asset IDs

---

## InterRealmBridge

Contract for managing trustless cross-realm transfers.

### State Variables

```solidity
mapping(uint256 => Transfer) public transfers;
mapping(bytes32 => uint256) public transferHashToId;
uint256 public transferCounter;
address public assetRegistry;
address public zkVerifier;
address public admin;
mapping(uint256 => address) public realmValidators;
uint256 public baseFee;
uint256 public intergalacticFee;
```

### Structures

#### Transfer
```solidity
struct Transfer {
    uint256 transferId;
    uint256 assetId;
    address sender;
    address recipient;
    uint256 sourceRealmId;
    uint256 destinationRealmId;
    uint256 sourceGalaxyId;
    uint256 destinationGalaxyId;
    bytes32 transferHash;
    TransferStatus status;
    uint256 initiatedAt;
    uint256 completedAt;
}
```

#### TransferStatus
```solidity
enum TransferStatus {
    Pending,
    Validated,
    InTransit,
    Completed,
    Failed,
    Cancelled
}
```

### Functions

#### initiateTransfer
```solidity
function initiateTransfer(
    uint256 _assetId,
    address _recipient,
    uint256 _sourceRealmId,
    uint256 _destinationRealmId,
    uint256 _sourceGalaxyId,
    uint256 _destinationGalaxyId
) external payable returns (uint256)
```

Initiate a cross-realm asset transfer.

**Parameters:**
- `_assetId`: ID of asset to transfer
- `_recipient`: Recipient address in destination realm
- `_sourceRealmId`: Source realm ID
- `_destinationRealmId`: Destination realm ID
- `_sourceGalaxyId`: Source galaxy ID
- `_destinationGalaxyId`: Destination galaxy ID

**Payable:**
- Must include sufficient fee (baseFee + intergalacticFee if cross-galaxy)

**Returns:**
- `uint256`: Transfer ID

**Events Emitted:**
- `TransferInitiated(...)`

**Example:**
```javascript
const fee = ethers.utils.parseEther("0.001");
const tx = await bridge.initiateTransfer(
    assetId,
    recipientAddress,
    1, // source realm
    2, // destination realm
    1, // source galaxy
    1, // destination galaxy
    { value: fee }
);
```

---

#### validateTransfer
```solidity
function validateTransfer(uint256 _transferId, bytes memory _proof) 
    external 
    onlyValidator(transfers[_transferId].sourceRealmId)
```

Validate a transfer with ZK proof.

**Parameters:**
- `_transferId`: ID of transfer to validate
- `_proof`: ZK-SNARK proof

**Requirements:**
- Caller must be authorized validator for source realm
- Transfer must be in Pending status
- Proof must be valid

**Events Emitted:**
- `TransferValidated(uint256 transferId, bytes32 transferHash)`

---

#### setInTransit
```solidity
function setInTransit(uint256 _transferId) 
    external 
    onlyValidator(transfers[_transferId].destinationRealmId)
```

Mark transfer as in-transit.

**Parameters:**
- `_transferId`: Transfer ID

**Requirements:**
- Caller must be destination realm validator
- Transfer must be Validated

**Events Emitted:**
- `TransferInTransit(uint256 transferId, uint256 timestamp)`

---

#### completeTransfer
```solidity
function completeTransfer(uint256 _transferId) 
    external 
    onlyValidator(transfers[_transferId].destinationRealmId)
```

Complete a transfer (final step).

**Parameters:**
- `_transferId`: Transfer ID

**Requirements:**
- Transfer must be InTransit
- Caller must be destination realm validator

**Events Emitted:**
- `TransferCompleted(uint256 transferId, uint256 timestamp)`

---

#### cancelTransfer
```solidity
function cancelTransfer(uint256 _transferId) external
```

Cancel a pending transfer.

**Parameters:**
- `_transferId`: Transfer ID

**Requirements:**
- Caller must be transfer sender or admin
- Transfer must be Pending

**Events Emitted:**
- `TransferCancelled(uint256 transferId)`

---

#### getTransfer
```solidity
function getTransfer(uint256 _transferId) external view returns (Transfer memory)
```

Get complete transfer information.

**Parameters:**
- `_transferId`: Transfer ID

**Returns:**
- `Transfer`: Complete transfer struct

---

#### setRealmValidator
```solidity
function setRealmValidator(uint256 _realmId, address _validator) external onlyAdmin
```

Set validator for a realm.

**Parameters:**
- `_realmId`: Realm ID
- `_validator`: Validator address

**Events Emitted:**
- `RealmValidatorUpdated(uint256 realmId, address validator)`

---

#### updateFees
```solidity
function updateFees(uint256 _baseFee, uint256 _intergalacticFee) external onlyAdmin
```

Update transfer fees.

**Parameters:**
- `_baseFee`: New base fee
- `_intergalacticFee`: New intergalactic fee

**Events Emitted:**
- `FeesUpdated(uint256 baseFee, uint256 intergalacticFee)`

---

## ZKRollupVerifier

Contract for zero-knowledge proof verification and batch processing.

### State Variables

```solidity
mapping(uint256 => Batch) public batches;
mapping(bytes32 => bool) public verifiedProofs;
uint256 public batchCounter;
bytes32 public currentStateRoot;
address public admin;
mapping(address => bool) public trustedSequencers;
```

### Structures

#### Batch
```solidity
struct Batch {
    uint256 batchId;
    bytes32 stateRoot;
    bytes32 previousStateRoot;
    uint256 transactionCount;
    uint256 timestamp;
    bool verified;
}
```

### Functions

#### submitBatch
```solidity
function submitBatch(
    bytes32 _stateRoot,
    uint256 _transactionCount,
    bytes memory _proof
) external onlySequencer returns (uint256)
```

Submit a new batch for verification.

**Parameters:**
- `_stateRoot`: New state root after batch
- `_transactionCount`: Number of transactions in batch
- `_proof`: ZK proof for batch

**Returns:**
- `uint256`: Batch ID

**Requirements:**
- Caller must be trusted sequencer

**Events Emitted:**
- `BatchSubmitted(uint256 batchId, bytes32 stateRoot, uint256 transactionCount)`

---

#### verifyProof
```solidity
function verifyProof(bytes memory _proof, bytes32 _publicHash) external returns (bool)
```

Verify a ZK-SNARK proof.

**Parameters:**
- `_proof`: Proof bytes
- `_publicHash`: Public input hash

**Returns:**
- `bool`: True if proof is valid

**Events Emitted:**
- `ProofVerified(bytes32 proofHash, bool isValid)`

---

#### verifyBatch
```solidity
function verifyBatch(uint256 _batchId, bytes memory _proof) external onlySequencer
```

Verify and finalize a batch.

**Parameters:**
- `_batchId`: Batch ID to verify
- `_proof`: ZK proof

**Requirements:**
- Batch must not be already verified
- Proof must be valid

**Events Emitted:**
- `BatchVerified(uint256 batchId, bytes32 stateRoot)`
- `StateRootUpdated(bytes32 oldRoot, bytes32 newRoot)`

---

#### addSequencer
```solidity
function addSequencer(address _sequencer) external onlyAdmin
```

Add a trusted sequencer.

**Parameters:**
- `_sequencer`: Sequencer address

**Events Emitted:**
- `SequencerAdded(address sequencer)`

---

#### getBatch
```solidity
function getBatch(uint256 _batchId) external view returns (Batch memory)
```

Get batch information.

**Parameters:**
- `_batchId`: Batch ID

**Returns:**
- `Batch`: Complete batch struct

---

## RealmGovernance

Contract for decentralized governance of the inter-realm system.

### State Variables

```solidity
mapping(address => uint256) public votingPower;
mapping(uint256 => Proposal) public proposals;
uint256 public proposalCounter;
uint256 public votingPeriod;
uint256 public proposalThreshold;
uint256 public quorumPercentage;
uint256 public totalVotingPower;
```

### Functions

#### createProposal
```solidity
function createProposal(
    string memory _description,
    ProposalType _proposalType,
    bytes memory _executionData
) external returns (uint256)
```

Create a new governance proposal.

**Parameters:**
- `_description`: Proposal description
- `_proposalType`: Type of proposal
- `_executionData`: Encoded execution data

**Returns:**
- `uint256`: Proposal ID

**Requirements:**
- Caller must have sufficient voting power (>= proposalThreshold)

**Events Emitted:**
- `ProposalCreated(...)`

---

#### castVote
```solidity
function castVote(uint256 _proposalId, bool _support) external
```

Cast a vote on a proposal.

**Parameters:**
- `_proposalId`: Proposal ID
- `_support`: True for yes, false for no

**Requirements:**
- Proposal must be active
- Voter must not have already voted
- Voter must have voting power

**Events Emitted:**
- `VoteCast(uint256 proposalId, address voter, bool support, uint256 weight)`

---

## Error Codes

Common error messages across contracts:

- `"Only admin can call this function"`: Caller lacks admin privileges
- `"Realm is not active"`: Target realm is deactivated
- `"Asset is locked"`: Asset is locked for transfer
- `"Not the asset owner"`: Caller doesn't own the asset
- `"Insufficient fee"`: Provided fee is too low
- `"Invalid proof"`: ZK proof verification failed
- `"Transfer not in pending state"`: Transfer in wrong state

## Events Summary

### Asset Registry Events
- `AssetRegistered(uint256 assetId, address owner, uint256 realmId, uint256 galaxyId)`
- `AssetTransferred(uint256 assetId, address from, address to, uint256 realmId)`
- `AssetLocked(uint256 assetId, uint256 destinationRealmId)`
- `AssetUnlocked(uint256 assetId, uint256 sourceRealmId)`
- `RealmRegistered(uint256 realmId, string name, address verifier)`

### Bridge Events
- `TransferInitiated(...)`
- `TransferValidated(uint256 transferId, bytes32 transferHash)`
- `TransferInTransit(uint256 transferId, uint256 timestamp)`
- `TransferCompleted(uint256 transferId, uint256 timestamp)`
- `TransferFailed(uint256 transferId, string reason)`
- `TransferCancelled(uint256 transferId)`

### Verifier Events
- `BatchSubmitted(uint256 batchId, bytes32 stateRoot, uint256 transactionCount)`
- `BatchVerified(uint256 batchId, bytes32 stateRoot)`
- `ProofVerified(bytes32 proofHash, bool isValid)`
- `StateRootUpdated(bytes32 oldRoot, bytes32 newRoot)`

---

**For more examples and integration guides, see the [Deployment Guide](DEPLOYMENT_GUIDE.md).**
