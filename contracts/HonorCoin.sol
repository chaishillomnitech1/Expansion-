// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HonorCoin
 * @dev Philanthropic token for Shield of Honor™ Initiative
 * Automatically allocates 7.77% of transaction fees to ethical support fund
 */
contract HonorCoin is ERC20, Ownable, ReentrancyGuard {
    // Fee percentage: 7.77% = 777 basis points
    uint256 public constant FEE_PERCENTAGE = 777;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Treasury address for ethical support fund
    address public treasuryAddress;
    
    // Total fees collected
    uint256 public totalFeesCollected;
    
    // Exemption mapping for specific addresses (e.g., staking contracts)
    mapping(address => bool) public isExemptFromFees;
    
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);
    event FeesCollected(address indexed from, address indexed to, uint256 amount);
    event ExemptionUpdated(address indexed account, bool exempt);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address _treasuryAddress
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_treasuryAddress != address(0), "Treasury address cannot be zero");
        treasuryAddress = _treasuryAddress;
        
        // Mint initial supply to deployer
        _mint(msg.sender, initialSupply);
        
        // Exempt treasury and owner from fees
        isExemptFromFees[_treasuryAddress] = true;
        isExemptFromFees[msg.sender] = true;
    }
    
    /**
     * @dev Override transfer to apply philanthropic fee
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        
        // Check if either party is exempt from fees
        if (isExemptFromFees[from] || isExemptFromFees[to]) {
            super._transfer(from, to, amount);
            return;
        }
        
        // Calculate fee: 7.77% of transaction
        uint256 feeAmount = (amount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        uint256 transferAmount = amount - feeAmount;
        
        // Transfer fee to treasury
        if (feeAmount > 0) {
            super._transfer(from, treasuryAddress, feeAmount);
            totalFeesCollected += feeAmount;
            emit FeesCollected(from, to, feeAmount);
        }
        
        // Transfer remaining amount to recipient
        super._transfer(from, to, transferAmount);
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasuryAddress(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Treasury address cannot be zero");
        address oldTreasury = treasuryAddress;
        treasuryAddress = _newTreasury;
        
        // Update exemptions
        isExemptFromFees[oldTreasury] = false;
        isExemptFromFees[_newTreasury] = true;
        
        emit TreasuryUpdated(oldTreasury, _newTreasury);
    }
    
    /**
     * @dev Set fee exemption for an address
     */
    function setFeeExemption(address account, bool exempt) external onlyOwner {
        require(account != address(0), "Account cannot be zero address");
        isExemptFromFees[account] = exempt;
        emit ExemptionUpdated(account, exempt);
    }
    
    /**
     * @dev Get effective fee percentage
     */
    function getFeePercentage() external pure returns (uint256, uint256) {
        return (FEE_PERCENTAGE, FEE_DENOMINATOR);
    }
}
