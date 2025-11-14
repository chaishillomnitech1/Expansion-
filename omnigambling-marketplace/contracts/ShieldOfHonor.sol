// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ShieldOfHonor
 * @dev High-value NFT contract for law enforcement impact
 * @author Chais Hill | Omnitech1
 * 
 * Features:
 * - Minting tied to marketplace governance
 * - Dynamic metadata via Chainlink integration
 * - First edition for law enforcement impact
 */
contract ShieldOfHonor is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Marketplace governance
    address public marketplaceGovernance;
    
    // Edition tracking
    uint256 public constant FIRST_EDITION_MAX = 1000;
    uint256 public firstEditionMinted;
    
    // Metadata and pricing
    string public baseMetadataURI;
    uint256 public mintPrice;
    
    // Chainlink oracle for dynamic metadata
    address public chainlinkOracle;
    
    // Events
    event ShieldMinted(address indexed to, uint256 indexed tokenId, uint256 edition);
    event MetadataUpdated(uint256 indexed tokenId, string newURI);
    event GovernanceUpdated(address indexed newGovernance);
    event ChainlinkOracleUpdated(address indexed newOracle);
    
    // Modifiers
    modifier onlyGovernance() {
        require(msg.sender == marketplaceGovernance || msg.sender == owner(), "Not authorized");
        _;
    }
    
    constructor(
        string memory _baseMetadataURI,
        uint256 _mintPrice,
        address _marketplaceGovernance
    ) ERC721("Shield of Honor", "SHIELD") {
        baseMetadataURI = _baseMetadataURI;
        mintPrice = _mintPrice;
        marketplaceGovernance = _marketplaceGovernance;
    }
    
    /**
     * @dev Mint a Shield of Honor NFT
     * @param to Address to mint to
     * @param metadataURI Metadata URI for the token
     */
    function mintShield(address to, string memory metadataURI) 
        public 
        payable 
        onlyGovernance 
        returns (uint256) 
    {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(firstEditionMinted < FIRST_EDITION_MAX, "First edition sold out");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        firstEditionMinted++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        emit ShieldMinted(to, tokenId, 1);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint multiple Shield NFTs
     * @param recipients Array of recipient addresses
     * @param metadataURIs Array of metadata URIs
     */
    function batchMint(
        address[] memory recipients, 
        string[] memory metadataURIs
    ) 
        public 
        onlyGovernance 
        returns (uint256[] memory) 
    {
        require(recipients.length == metadataURIs.length, "Array length mismatch");
        require(
            firstEditionMinted + recipients.length <= FIRST_EDITION_MAX,
            "Exceeds first edition limit"
        );
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            firstEditionMinted++;
            
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, metadataURIs[i]);
            
            tokenIds[i] = tokenId;
            emit ShieldMinted(recipients[i], tokenId, 1);
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Update metadata for dynamic updates via Chainlink
     * @param tokenId Token ID to update
     * @param newURI New metadata URI
     */
    function updateMetadata(uint256 tokenId, string memory newURI) 
        public 
        onlyGovernance 
    {
        require(_exists(tokenId), "Token does not exist");
        _setTokenURI(tokenId, newURI);
        emit MetadataUpdated(tokenId, newURI);
    }
    
    /**
     * @dev Update Chainlink oracle address
     * @param newOracle New oracle address
     */
    function updateChainlinkOracle(address newOracle) public onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        chainlinkOracle = newOracle;
        emit ChainlinkOracleUpdated(newOracle);
    }
    
    /**
     * @dev Update marketplace governance address
     * @param newGovernance New governance address
     */
    function updateGovernance(address newGovernance) public onlyOwner {
        require(newGovernance != address(0), "Invalid governance address");
        marketplaceGovernance = newGovernance;
        emit GovernanceUpdated(newGovernance);
    }
    
    /**
     * @dev Update mint price
     * @param newPrice New mint price
     */
    function updateMintPrice(uint256 newPrice) public onlyOwner {
        mintPrice = newPrice;
    }
    
    /**
     * @dev Update base metadata URI
     * @param newBaseURI New base URI
     */
    function updateBaseMetadataURI(string memory newBaseURI) public onlyOwner {
        baseMetadataURI = newBaseURI;
    }
    
    /**
     * @dev Withdraw contract balance
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
