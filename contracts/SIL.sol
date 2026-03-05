// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title Sovereign Identity Lock (SIL)
 * @notice Ultimate defensive layer establishing singularity of command and authentication
 * @dev Master Governor Key for ScrollVerse Sovereign Operations
 * @author Chais Hill - CHAIS THE GREAT ∞
 */
contract SovereignIdentityLock {
    
    // ============ State Variables ============
    
    /// @notice The Sovereign Identity - CHAIS THE GREAT ∞
    address public immutable sovereignIdentity;
    
    /// @notice ScrollBond NFT hash for verification
    bytes32 public scrollBondNFTHash;
    
    /// @notice Sovereign Lock Protocol status
    bool public sovereignLockActive;
    
    /// @notice Metamask API integration key hash (stored securely)
    bytes32 private metamaskAPIKeyHash;
    
    /// @notice Master Governor Key status
    bool public masterGovernorKeyEnabled;
    
    /// @notice Mapping of authorized DAO addresses
    mapping(address => bool) public authorizedDAOs;
    
    /// @notice Mapping of verified operations
    mapping(bytes32 => bool) public verifiedOperations;
    
    /// @notice Counter for operation nonces
    uint256 public operationNonce;
    
    // ============ Events ============
    
    event SovereignLockActivated(address indexed by, uint256 timestamp);
    event SovereignLockDeactivated(address indexed by, uint256 timestamp);
    event ScrollBondHashUpdated(bytes32 indexed oldHash, bytes32 indexed newHash);
    event DAOAuthorized(address indexed dao, uint256 timestamp);
    event DAORevoked(address indexed dao, uint256 timestamp);
    event OperationVerified(bytes32 indexed operationHash, address indexed initiator);
    event MasterGovernorKeyToggled(bool status, uint256 timestamp);
    event MetamaskAPIKeyUpdated(uint256 timestamp);
    
    // ============ Modifiers ============
    
    modifier onlySovereign() {
        require(msg.sender == sovereignIdentity, "SIL: Not the Sovereign");
        _;
    }
    
    modifier lockActive() {
        require(sovereignLockActive, "SIL: Lock not active");
        _;
    }
    
    modifier authorizedDAO() {
        require(authorizedDAOs[msg.sender] || msg.sender == sovereignIdentity, 
                "SIL: DAO not authorized");
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @notice Initialize the Sovereign Identity Lock
     * @param _scrollBondHash Initial ScrollBond NFT hash
     */
    constructor(bytes32 _scrollBondHash) {
        sovereignIdentity = msg.sender;
        scrollBondNFTHash = _scrollBondHash;
        sovereignLockActive = true;
        masterGovernorKeyEnabled = true;
        
        emit SovereignLockActivated(msg.sender, block.timestamp);
        emit ScrollBondHashUpdated(bytes32(0), _scrollBondHash);
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Activate the Sovereign Lock Protocol
     */
    function activateSovereignLock() external onlySovereign {
        require(!sovereignLockActive, "SIL: Already active");
        sovereignLockActive = true;
        emit SovereignLockActivated(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Deactivate the Sovereign Lock Protocol (emergency only)
     */
    function deactivateSovereignLock() external onlySovereign {
        require(sovereignLockActive, "SIL: Already inactive");
        sovereignLockActive = false;
        emit SovereignLockDeactivated(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Update the ScrollBond NFT hash
     * @param _newHash New ScrollBond NFT hash
     */
    function updateScrollBondHash(bytes32 _newHash) external onlySovereign {
        bytes32 oldHash = scrollBondNFTHash;
        scrollBondNFTHash = _newHash;
        emit ScrollBondHashUpdated(oldHash, _newHash);
    }
    
    /**
     * @notice Update Metamask API key hash
     * @param _apiKeyHash Hashed API key for secure storage
     */
    function updateMetamaskAPIKey(bytes32 _apiKeyHash) external onlySovereign {
        metamaskAPIKeyHash = _apiKeyHash;
        emit MetamaskAPIKeyUpdated(block.timestamp);
    }
    
    /**
     * @notice Toggle Master Governor Key status
     */
    function toggleMasterGovernorKey() external onlySovereign {
        masterGovernorKeyEnabled = !masterGovernorKeyEnabled;
        emit MasterGovernorKeyToggled(masterGovernorKeyEnabled, block.timestamp);
    }
    
    // ============ DAO Management Functions ============
    
    /**
     * @notice Authorize a DAO for Interstellar Alliance operations
     * @param _dao Address of the DAO to authorize
     */
    function authorizeDAO(address _dao) external onlySovereign {
        require(_dao != address(0), "SIL: Invalid DAO address");
        require(!authorizedDAOs[_dao], "SIL: DAO already authorized");
        
        authorizedDAOs[_dao] = true;
        emit DAOAuthorized(_dao, block.timestamp);
    }
    
    /**
     * @notice Revoke DAO authorization
     * @param _dao Address of the DAO to revoke
     */
    function revokeDAO(address _dao) external onlySovereign {
        require(authorizedDAOs[_dao], "SIL: DAO not authorized");
        
        authorizedDAOs[_dao] = false;
        emit DAORevoked(_dao, block.timestamp);
    }
    
    // ============ Authentication & Verification Functions ============
    
    /**
     * @notice Verify an operation against the Sovereign Identity
     * @param _operationData Operation data to verify
     * @param _signature Signature from authorized entity
     * @return bool Operation verification status
     */
    function verifyOperation(
        bytes memory _operationData,
        bytes memory _signature
    ) external lockActive authorizedDAO returns (bool) {
        // Generate operation hash
        bytes32 operationHash = keccak256(
            abi.encodePacked(_operationData, operationNonce, block.timestamp)
        );
        
        // Verify signature matches sovereign identity or authorized DAO
        address signer = recoverSigner(operationHash, _signature);
        require(
            signer == sovereignIdentity || authorizedDAOs[signer],
            "SIL: Invalid signature"
        );
        
        // Mark operation as verified
        verifiedOperations[operationHash] = true;
        operationNonce++;
        
        emit OperationVerified(operationHash, msg.sender);
        return true;
    }
    
    /**
     * @notice Authenticate against Sovereign Identity with API key
     * @param _apiKey Plain API key for verification
     * @return bool Authentication status
     */
    function authenticateWithAPIKey(string memory _apiKey) 
        external 
        view 
        lockActive 
        returns (bool) 
    {
        bytes32 providedHash = keccak256(abi.encodePacked(_apiKey));
        return providedHash == metamaskAPIKeyHash;
    }
    
    /**
     * @notice Verify ScrollBond NFT hash matches
     * @param _hash Hash to verify
     * @return bool Verification status
     */
    function verifyScrollBondHash(bytes32 _hash) 
        external 
        view 
        lockActive 
        returns (bool) 
    {
        return _hash == scrollBondNFTHash;
    }
    
    /**
     * @notice Check if an operation has been verified
     * @param _operationHash Hash of the operation
     * @return bool Verification status
     */
    function isOperationVerified(bytes32 _operationHash) 
        external 
        view 
        returns (bool) 
    {
        return verifiedOperations[_operationHash];
    }
    
    /**
     * @notice Get comprehensive lock status
     * @return lockStatus Lock active status
     * @return governorKeyStatus Master Governor Key status
     * @return currentNonce Current operation nonce
     * @return sovereign Sovereign identity address
     */
    function getLockStatus() 
        external 
        view 
        returns (
            bool lockStatus,
            bool governorKeyStatus,
            uint256 currentNonce,
            address sovereign
        ) 
    {
        return (
            sovereignLockActive,
            masterGovernorKeyEnabled,
            operationNonce,
            sovereignIdentity
        );
    }
    
    // ============ Internal Functions ============
    
    /**
     * @notice Recover signer from message hash and signature
     * @param _messageHash Hash of the message
     * @param _signature Signature bytes
     * @return address Recovered signer address
     */
    function recoverSigner(bytes32 _messageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        require(_signature.length == 65, "SIL: Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        
        if (v < 27) {
            v += 27;
        }
        
        require(v == 27 || v == 28, "SIL: Invalid signature v value");
        
        return ecrecover(_messageHash, v, r, s);
    }
}
