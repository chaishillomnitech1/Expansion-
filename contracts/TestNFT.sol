// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestNFT
 * @dev Simple NFT contract for testing marketplace functionality
 */
contract TestNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("Test NFT", "TNFT") Ownable(msg.sender) {}
    
    function mint(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
