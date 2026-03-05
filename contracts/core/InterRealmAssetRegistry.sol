// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title InterRealmAssetRegistry
 * @dev Registry for tracking digital assets across multiple realms and galaxies
 * @notice Part of the OmniGambling Revolution trustless architecture
 * @author Chais Hill | Omnitech1
 */
contract InterRealmAssetRegistry {
    
    // Asset structure for cross-realm tracking
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
    
    // Realm structure
    struct Realm {
        uint256 realmId;
        string name;
        bool isActive;
        address verifier;
    }
    
    // Mapping of asset ID to Asset
    mapping(uint256 => Asset) public assets;
    
    // Mapping of realm ID to Realm
    mapping(uint256 => Realm) public realms;
    
    // Mapping of owner to asset IDs
    mapping(address => uint256[]) public ownerAssets;
    
    // Counter for asset IDs
    uint256 public assetCounter;
    
    // Counter for realm IDs
    uint256 public realmCounter;
    
    // Admin address
    address public admin;
    
    // Events
    event AssetRegistered(uint256 indexed assetId, address indexed owner, uint256 realmId, uint256 galaxyId);
    event AssetTransferred(uint256 indexed assetId, address indexed from, address indexed to, uint256 realmId);
    event AssetLocked(uint256 indexed assetId, uint256 destinationRealmId);
    event AssetUnlocked(uint256 indexed assetId, uint256 sourceRealmId);
    event RealmRegistered(uint256 indexed realmId, string name, address verifier);
    event RealmStatusUpdated(uint256 indexed realmId, bool isActive);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyAssetOwner(uint256 _assetId) {
        require(assets[_assetId].owner == msg.sender, "Not the asset owner");
        _;
    }
    
    modifier assetNotLocked(uint256 _assetId) {
        require(!assets[_assetId].isLocked, "Asset is locked for transfer");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        assetCounter = 0;
        realmCounter = 0;
    }
    
    /**
     * @dev Register a new realm
     */
    function registerRealm(string memory _name, address _verifier) external onlyAdmin returns (uint256) {
        realmCounter++;
        realms[realmCounter] = Realm({
            realmId: realmCounter,
            name: _name,
            isActive: true,
            verifier: _verifier
        });
        
        emit RealmRegistered(realmCounter, _name, _verifier);
        return realmCounter;
    }
    
    /**
     * @dev Register a new asset in a realm
     */
    function registerAsset(
        uint256 _realmId,
        uint256 _galaxyId,
        bytes32 _assetHash,
        uint256 _value
    ) external returns (uint256) {
        require(realms[_realmId].isActive, "Realm is not active");
        
        assetCounter++;
        assets[assetCounter] = Asset({
            assetId: assetCounter,
            owner: msg.sender,
            realmId: _realmId,
            galaxyId: _galaxyId,
            assetHash: _assetHash,
            value: _value,
            isLocked: false,
            timestamp: block.timestamp
        });
        
        ownerAssets[msg.sender].push(assetCounter);
        
        emit AssetRegistered(assetCounter, msg.sender, _realmId, _galaxyId);
        return assetCounter;
    }
    
    /**
     * @dev Lock an asset for cross-realm transfer
     */
    function lockAsset(uint256 _assetId, uint256 _destinationRealmId) 
        external 
        onlyAssetOwner(_assetId) 
        assetNotLocked(_assetId) 
    {
        require(realms[_destinationRealmId].isActive, "Destination realm is not active");
        assets[_assetId].isLocked = true;
        
        emit AssetLocked(_assetId, _destinationRealmId);
    }
    
    /**
     * @dev Unlock an asset after cross-realm transfer completion
     */
    function unlockAsset(uint256 _assetId, address _newOwner, uint256 _sourceRealmId) 
        external 
        onlyAdmin 
    {
        require(assets[_assetId].isLocked, "Asset is not locked");
        
        address previousOwner = assets[_assetId].owner;
        assets[_assetId].owner = _newOwner;
        assets[_assetId].isLocked = false;
        assets[_assetId].realmId = _sourceRealmId;
        
        ownerAssets[_newOwner].push(_assetId);
        
        emit AssetUnlocked(_assetId, _sourceRealmId);
        emit AssetTransferred(_assetId, previousOwner, _newOwner, _sourceRealmId);
    }
    
    /**
     * @dev Get asset details
     */
    function getAsset(uint256 _assetId) external view returns (Asset memory) {
        return assets[_assetId];
    }
    
    /**
     * @dev Get all assets owned by an address
     */
    function getOwnerAssets(address _owner) external view returns (uint256[] memory) {
        return ownerAssets[_owner];
    }
    
    /**
     * @dev Update realm status
     */
    function updateRealmStatus(uint256 _realmId, bool _isActive) external onlyAdmin {
        realms[_realmId].isActive = _isActive;
        emit RealmStatusUpdated(_realmId, _isActive);
    }
    
    /**
     * @dev Get realm details
     */
    function getRealm(uint256 _realmId) external view returns (Realm memory) {
        return realms[_realmId];
    }
}
