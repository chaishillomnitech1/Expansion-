// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title InterRealmBridge
 * @dev Trustless bridge for secure asset transfers between realms and galaxies
 * @notice Core component of the OmniGambling Revolution architecture
 * @author Chais Hill | Omnitech1
 */
contract InterRealmBridge {
    
    // Transfer structure
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
    
    // Transfer status enumeration
    enum TransferStatus {
        Pending,
        Validated,
        InTransit,
        Completed,
        Failed,
        Cancelled
    }
    
    // Mapping of transfer ID to Transfer
    mapping(uint256 => Transfer) public transfers;
    
    // Mapping of transfer hash to transfer ID (for verification)
    mapping(bytes32 => uint256) public transferHashToId;
    
    // Counter for transfer IDs
    uint256 public transferCounter;
    
    // Asset registry contract address
    address public assetRegistry;
    
    // ZK-Rollup verifier address
    address public zkVerifier;
    
    // Admin address
    address public admin;
    
    // Realm validators
    mapping(uint256 => address) public realmValidators;
    
    // Transfer fees
    uint256 public baseFee;
    uint256 public intergalacticFee;
    
    // Events
    event TransferInitiated(
        uint256 indexed transferId,
        uint256 indexed assetId,
        address indexed sender,
        address recipient,
        uint256 sourceRealmId,
        uint256 destinationRealmId
    );
    event TransferValidated(uint256 indexed transferId, bytes32 transferHash);
    event TransferInTransit(uint256 indexed transferId, uint256 timestamp);
    event TransferCompleted(uint256 indexed transferId, uint256 timestamp);
    event TransferFailed(uint256 indexed transferId, string reason);
    event TransferCancelled(uint256 indexed transferId);
    event RealmValidatorUpdated(uint256 indexed realmId, address validator);
    event FeesUpdated(uint256 baseFee, uint256 intergalacticFee);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyValidator(uint256 _realmId) {
        require(
            msg.sender == realmValidators[_realmId] || msg.sender == admin,
            "Not authorized validator"
        );
        _;
    }
    
    constructor(address _assetRegistry, address _zkVerifier) {
        admin = msg.sender;
        assetRegistry = _assetRegistry;
        zkVerifier = _zkVerifier;
        transferCounter = 0;
        baseFee = 0.001 ether;
        intergalacticFee = 0.01 ether;
    }
    
    /**
     * @dev Initiate a cross-realm transfer
     */
    function initiateTransfer(
        uint256 _assetId,
        address _recipient,
        uint256 _sourceRealmId,
        uint256 _destinationRealmId,
        uint256 _sourceGalaxyId,
        uint256 _destinationGalaxyId
    ) external payable returns (uint256) {
        // Calculate required fee
        uint256 requiredFee = baseFee;
        if (_sourceGalaxyId != _destinationGalaxyId) {
            requiredFee += intergalacticFee;
        }
        require(msg.value >= requiredFee, "Insufficient fee");
        
        // Create transfer
        transferCounter++;
        bytes32 transferHash = keccak256(
            abi.encodePacked(
                transferCounter,
                _assetId,
                msg.sender,
                _recipient,
                _sourceRealmId,
                _destinationRealmId,
                block.timestamp
            )
        );
        
        transfers[transferCounter] = Transfer({
            transferId: transferCounter,
            assetId: _assetId,
            sender: msg.sender,
            recipient: _recipient,
            sourceRealmId: _sourceRealmId,
            destinationRealmId: _destinationRealmId,
            sourceGalaxyId: _sourceGalaxyId,
            destinationGalaxyId: _destinationGalaxyId,
            transferHash: transferHash,
            status: TransferStatus.Pending,
            initiatedAt: block.timestamp,
            completedAt: 0
        });
        
        transferHashToId[transferHash] = transferCounter;
        
        emit TransferInitiated(
            transferCounter,
            _assetId,
            msg.sender,
            _recipient,
            _sourceRealmId,
            _destinationRealmId
        );
        
        return transferCounter;
    }
    
    /**
     * @dev Validate a transfer (called by realm validator)
     */
    function validateTransfer(uint256 _transferId, bytes memory _proof) 
        external 
        onlyValidator(transfers[_transferId].sourceRealmId) 
    {
        require(
            transfers[_transferId].status == TransferStatus.Pending,
            "Transfer not in pending state"
        );
        
        // Validate proof through ZK verifier
        (bool isValid, ) = zkVerifier.call(
            abi.encodeWithSignature("verifyProof(bytes,bytes32)", _proof, transfers[_transferId].transferHash)
        );
        
        require(isValid, "Invalid proof");
        
        transfers[_transferId].status = TransferStatus.Validated;
        
        emit TransferValidated(_transferId, transfers[_transferId].transferHash);
    }
    
    /**
     * @dev Set transfer in transit (called by destination realm validator)
     */
    function setInTransit(uint256 _transferId) 
        external 
        onlyValidator(transfers[_transferId].destinationRealmId) 
    {
        require(
            transfers[_transferId].status == TransferStatus.Validated,
            "Transfer not validated"
        );
        
        transfers[_transferId].status = TransferStatus.InTransit;
        
        emit TransferInTransit(_transferId, block.timestamp);
    }
    
    /**
     * @dev Complete a transfer (finalize asset transfer)
     */
    function completeTransfer(uint256 _transferId) 
        external 
        onlyValidator(transfers[_transferId].destinationRealmId) 
    {
        require(
            transfers[_transferId].status == TransferStatus.InTransit,
            "Transfer not in transit"
        );
        
        transfers[_transferId].status = TransferStatus.Completed;
        transfers[_transferId].completedAt = block.timestamp;
        
        emit TransferCompleted(_transferId, block.timestamp);
    }
    
    /**
     * @dev Cancel a pending transfer
     */
    function cancelTransfer(uint256 _transferId) external {
        require(
            msg.sender == transfers[_transferId].sender || msg.sender == admin,
            "Not authorized to cancel"
        );
        require(
            transfers[_transferId].status == TransferStatus.Pending,
            "Cannot cancel transfer in current state"
        );
        
        transfers[_transferId].status = TransferStatus.Cancelled;
        
        emit TransferCancelled(_transferId);
    }
    
    /**
     * @dev Mark a transfer as failed
     */
    function markTransferFailed(uint256 _transferId, string memory _reason) 
        external 
        onlyAdmin 
    {
        transfers[_transferId].status = TransferStatus.Failed;
        
        emit TransferFailed(_transferId, _reason);
    }
    
    /**
     * @dev Get transfer details
     */
    function getTransfer(uint256 _transferId) external view returns (Transfer memory) {
        return transfers[_transferId];
    }
    
    /**
     * @dev Set realm validator
     */
    function setRealmValidator(uint256 _realmId, address _validator) external onlyAdmin {
        realmValidators[_realmId] = _validator;
        emit RealmValidatorUpdated(_realmId, _validator);
    }
    
    /**
     * @dev Update fees
     */
    function updateFees(uint256 _baseFee, uint256 _intergalacticFee) external onlyAdmin {
        baseFee = _baseFee;
        intergalacticFee = _intergalacticFee;
        emit FeesUpdated(_baseFee, _intergalacticFee);
    }
    
    /**
     * @dev Update asset registry address
     */
    function updateAssetRegistry(address _newRegistry) external onlyAdmin {
        assetRegistry = _newRegistry;
    }
    
    /**
     * @dev Update ZK verifier address
     */
    function updateZKVerifier(address _newVerifier) external onlyAdmin {
        zkVerifier = _newVerifier;
    }
    
    /**
     * @dev Withdraw collected fees
     */
    function withdrawFees(address payable _recipient) external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        _recipient.transfer(balance);
    }
    
    /**
     * @dev Get transfer by hash
     */
    function getTransferByHash(bytes32 _transferHash) external view returns (Transfer memory) {
        uint256 transferId = transferHashToId[_transferHash];
        return transfers[transferId];
    }
}
