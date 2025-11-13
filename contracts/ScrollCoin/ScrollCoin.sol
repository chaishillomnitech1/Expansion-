// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ScrollCoin
 * @author Chais Hill - Omnitech1
 * @notice ScrollCoin token for the Omnitech1 ecosystem with LayerZero omnichain capabilities
 * @dev ERC20 token with pausable transfers and ownership controls
 */
contract ScrollCoin is ERC20, Ownable, Pausable {
    // Maximum supply cap
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Minting tracking
    uint256 public totalMinted;
    
    // Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor(
        address initialOwner
    ) ERC20("ScrollCoin", "SCROLL") Ownable(initialOwner) {
        // Mint initial supply to owner (10% of max supply)
        uint256 initialSupply = MAX_SUPPLY / 10;
        _mint(initialOwner, initialSupply);
        totalMinted = initialSupply;
        
        emit TokensMinted(initialOwner, initialSupply);
    }
    
    /**
     * @notice Mint new tokens (only owner)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalMinted + amount <= MAX_SUPPLY, "ScrollCoin: Max supply exceeded");
        _mint(to, amount);
        totalMinted += amount;
        
        emit TokensMinted(to, amount);
    }
    
    /**
     * @notice Burn tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @notice Pause all token transfers (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @notice Unpause token transfers (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to add pause functionality
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._update(from, to, amount);
    }
}
