// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HonorAuditNFT
 * @dev NFT contract for transparent audit trail in Shield of Honor™ Initiative
 * Each NFT represents a verifiable record of fund utilization
 */
contract HonorAuditNFT is ERC721URIStorage, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _tokenIdCounter;
    
    struct AuditMetadata {
        uint256 amount;
        string purpose;
        uint256 timestamp;
        address beneficiary;
        string proofURI;
    }
    
    mapping(uint256 => AuditMetadata) public auditRecords;
    
    event AuditNFTMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 amount,
        string purpose
    );
    
    constructor() ERC721("Honor Audit NFT", "HAUDIT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint an audit NFT
     */
    function mintAuditNFT(
        address recipient,
        uint256 amount,
        string memory purpose,
        address beneficiary,
        string memory proofURI,
        string memory tokenURI
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        auditRecords[tokenId] = AuditMetadata({
            amount: amount,
            purpose: purpose,
            timestamp: block.timestamp,
            beneficiary: beneficiary,
            proofURI: proofURI
        });
        
        emit AuditNFTMinted(tokenId, recipient, amount, purpose);
        
        return tokenId;
    }
    
    /**
     * @dev Get audit metadata for a token
     */
    function getAuditMetadata(uint256 tokenId) external view returns (AuditMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return auditRecords[tokenId];
    }
    
    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
