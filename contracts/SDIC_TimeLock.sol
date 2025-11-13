// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SDIC_TimeLock
 * @dev ScrollVerse Data Integrity Chain (SDIC) - Hyper-Secure Proof of Time
 * @notice Implements automatic time-stamping and hashing for operational data
 * @author Chais Hill - Omnitech1
 */
contract SDIC_TimeLock {
    
    // Structure for storing time-locked data entries
    struct DataEntry {
        bytes32 dataHash;           // Hash of the operational data
        uint256 timestamp;          // Block timestamp when data was stored
        address submitter;          // Address that submitted the data
        string dataType;            // Type of data (yield_flow, protection_alert, family_access)
        bool isLocked;              // Indicates if entry is permanently locked
        string metadata;            // Additional metadata for the entry
    }
    
    // Mapping from entry ID to DataEntry
    mapping(uint256 => DataEntry) public dataEntries;
    
    // Counter for total entries
    uint256 public entryCount;
    
    // Mapping to track authorized submitters
    mapping(address => bool) public authorizedSubmitters;
    
    // Owner of the contract
    address public owner;
    
    // ScrollVerse protocol compatibility flag
    bool public scrollVerseCompatible;
    
    // Events
    event DataStored(
        uint256 indexed entryId,
        bytes32 indexed dataHash,
        uint256 timestamp,
        address indexed submitter,
        string dataType
    );
    
    event DataLocked(
        uint256 indexed entryId,
        uint256 lockTimestamp
    );
    
    event SubmitterAuthorized(
        address indexed submitter,
        uint256 timestamp
    );
    
    event SubmitterRevoked(
        address indexed submitter,
        uint256 timestamp
    );
    
    event ScrollVerseProtocolUpdated(
        bool enabled,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "SDIC: Caller is not the owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            authorizedSubmitters[msg.sender] || msg.sender == owner,
            "SDIC: Caller is not authorized"
        );
        _;
    }
    
    modifier entryExists(uint256 _entryId) {
        require(_entryId < entryCount, "SDIC: Entry does not exist");
        _;
    }
    
    /**
     * @dev Constructor - initializes the contract
     */
    constructor() {
        owner = msg.sender;
        scrollVerseCompatible = true;
        authorizedSubmitters[msg.sender] = true;
        entryCount = 0;
    }
    
    /**
     * @dev Store operational data with automatic time-stamping and hashing
     * @param _data Raw operational data to be hashed and stored
     * @param _dataType Type of data (e.g., "yield_flow", "protection_alert", "family_access")
     * @param _metadata Additional metadata for context
     * @return entryId The ID of the newly created entry
     */
    function storeData(
        bytes memory _data,
        string memory _dataType,
        string memory _metadata
    ) external onlyAuthorized returns (uint256) {
        // Generate hash of the data
        bytes32 dataHash = keccak256(_data);
        
        // Create new entry
        uint256 newEntryId = entryCount;
        dataEntries[newEntryId] = DataEntry({
            dataHash: dataHash,
            timestamp: block.timestamp,
            submitter: msg.sender,
            dataType: _dataType,
            isLocked: false,
            metadata: _metadata
        });
        
        entryCount++;
        
        emit DataStored(
            newEntryId,
            dataHash,
            block.timestamp,
            msg.sender,
            _dataType
        );
        
        return newEntryId;
    }
    
    /**
     * @dev Store yield flow data (7.77% ScrollCoin Zakat Flow)
     * @param _compoundId ID of the compound (1-50)
     * @param _yieldAmount Amount of yield in the flow
     * @param _flowData Encoded flow data
     * @return entryId The ID of the newly created entry
     */
    function storeYieldFlow(
        uint256 _compoundId,
        uint256 _yieldAmount,
        bytes memory _flowData
    ) external onlyAuthorized returns (uint256) {
        require(_compoundId >= 1 && _compoundId <= 50, "SDIC: Invalid compound ID");
        
        string memory metadata = string(
            abi.encodePacked(
                "compound_id:", 
                uint2str(_compoundId),
                ",yield_amount:",
                uint2str(_yieldAmount),
                ",zakat_rate:7.77%"
            )
        );
        
        return storeData(_flowData, "yield_flow", metadata);
    }
    
    /**
     * @dev Store protection alert data
     * @param _alertLevel Alert severity level
     * @param _alertData Encoded alert data
     * @return entryId The ID of the newly created entry
     */
    function storeProtectionAlert(
        string memory _alertLevel,
        bytes memory _alertData
    ) external onlyAuthorized returns (uint256) {
        string memory metadata = string(
            abi.encodePacked("alert_level:", _alertLevel)
        );
        
        return storeData(_alertData, "protection_alert", metadata);
    }
    
    /**
     * @dev Store family access log
     * @param _accessorAddress Address that accessed the system
     * @param _accessData Encoded access data
     * @return entryId The ID of the newly created entry
     */
    function storeFamilyAccessLog(
        address _accessorAddress,
        bytes memory _accessData
    ) external onlyAuthorized returns (uint256) {
        string memory metadata = string(
            abi.encodePacked(
                "accessor:",
                addressToString(_accessorAddress)
            )
        );
        
        return storeData(_accessData, "family_access", metadata);
    }
    
    /**
     * @dev Permanently lock a data entry to make it tamper-proof
     * @param _entryId ID of the entry to lock
     */
    function lockEntry(uint256 _entryId) 
        external 
        onlyAuthorized 
        entryExists(_entryId) 
    {
        require(!dataEntries[_entryId].isLocked, "SDIC: Entry already locked");
        
        dataEntries[_entryId].isLocked = true;
        
        emit DataLocked(_entryId, block.timestamp);
    }
    
    /**
     * @dev Verify data integrity by comparing hash
     * @param _entryId ID of the entry to verify
     * @param _data Original data to verify against
     * @return bool True if data matches the stored hash
     */
    function verifyDataIntegrity(
        uint256 _entryId,
        bytes memory _data
    ) external view entryExists(_entryId) returns (bool) {
        bytes32 computedHash = keccak256(_data);
        return dataEntries[_entryId].dataHash == computedHash;
    }
    
    /**
     * @dev Get data entry details
     * @param _entryId ID of the entry
     * @return DataEntry struct containing all entry details
     */
    function getDataEntry(uint256 _entryId) 
        external 
        view 
        entryExists(_entryId) 
        returns (DataEntry memory) 
    {
        return dataEntries[_entryId];
    }
    
    /**
     * @dev Get entries by data type
     * @param _dataType Type of data to filter by
     * @param _limit Maximum number of entries to return
     * @return Array of entry IDs matching the data type
     */
    function getEntriesByType(
        string memory _dataType,
        uint256 _limit
    ) external view returns (uint256[] memory) {
        uint256[] memory tempResults = new uint256[](entryCount);
        uint256 resultCount = 0;
        
        for (uint256 i = 0; i < entryCount && resultCount < _limit; i++) {
            if (keccak256(bytes(dataEntries[i].dataType)) == keccak256(bytes(_dataType))) {
                tempResults[resultCount] = i;
                resultCount++;
            }
        }
        
        // Create properly sized array
        uint256[] memory results = new uint256[](resultCount);
        for (uint256 i = 0; i < resultCount; i++) {
            results[i] = tempResults[i];
        }
        
        return results;
    }
    
    /**
     * @dev Authorize a new submitter
     * @param _submitter Address to authorize
     */
    function authorizeSubmitter(address _submitter) external onlyOwner {
        require(_submitter != address(0), "SDIC: Invalid address");
        require(!authorizedSubmitters[_submitter], "SDIC: Already authorized");
        
        authorizedSubmitters[_submitter] = true;
        
        emit SubmitterAuthorized(_submitter, block.timestamp);
    }
    
    /**
     * @dev Revoke submitter authorization
     * @param _submitter Address to revoke
     */
    function revokeSubmitter(address _submitter) external onlyOwner {
        require(_submitter != owner, "SDIC: Cannot revoke owner");
        require(authorizedSubmitters[_submitter], "SDIC: Not authorized");
        
        authorizedSubmitters[_submitter] = false;
        
        emit SubmitterRevoked(_submitter, block.timestamp);
    }
    
    /**
     * @dev Enable/disable ScrollVerse protocol compatibility
     * @param _enabled True to enable, false to disable
     */
    function setScrollVerseCompatibility(bool _enabled) external onlyOwner {
        scrollVerseCompatible = _enabled;
        
        emit ScrollVerseProtocolUpdated(_enabled, block.timestamp);
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SDIC: Invalid address");
        
        authorizedSubmitters[_newOwner] = true;
        owner = _newOwner;
    }
    
    /**
     * @dev Get contract statistics
     * @return totalEntries Total number of entries
     * @return lockedEntries Total number of locked entries
     * @return scrollVerseEnabled ScrollVerse compatibility status
     */
    function getContractStats() external view returns (
        uint256 totalEntries,
        uint256 lockedEntries,
        bool scrollVerseEnabled
    ) {
        uint256 locked = 0;
        for (uint256 i = 0; i < entryCount; i++) {
            if (dataEntries[i].isLocked) {
                locked++;
            }
        }
        
        return (entryCount, locked, scrollVerseCompatible);
    }
    
    // Helper functions
    
    /**
     * @dev Convert uint to string
     */
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
    
    /**
     * @dev Convert address to string
     */
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
}
