// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ScrollCoinOmniChainBridge
 * @author Chais Hill - Omnitech1
 * @notice Omnichain bridge for ScrollCoin using LayerZero protocol
 * @dev This contract enables cross-chain transfers of ScrollCoin
 */
contract ScrollCoinOmniChainBridge is Ownable, ReentrancyGuard {
    // ScrollCoin token reference
    IERC20 public scrollCoin;
    
    // LayerZero endpoint (placeholder - actual integration would use LayerZero interface)
    address public lzEndpoint;
    
    // Supported chain IDs for LayerZero
    mapping(uint16 => bool) public supportedChains;
    
    // Bridge fees (in basis points, 1 bp = 0.01%)
    uint256 public bridgeFee = 50; // 0.5% default fee
    
    // Accumulated fees
    uint256 public accumulatedFees;
    
    // Events
    event BridgeInitiated(
        address indexed sender,
        uint16 indexed destinationChainId,
        address indexed recipient,
        uint256 amount,
        uint256 fee
    );
    
    event BridgeCompleted(
        address indexed recipient,
        uint16 indexed sourceChainId,
        uint256 amount
    );
    
    event ChainSupported(uint16 indexed chainId, bool supported);
    event BridgeFeeUpdated(uint256 newFee);
    event FeesWithdrawn(address indexed to, uint256 amount);
    
    constructor(
        address initialOwner,
        address _scrollCoin,
        address _lzEndpoint
    ) Ownable(initialOwner) {
        require(_scrollCoin != address(0), "Invalid ScrollCoin address");
        require(_lzEndpoint != address(0), "Invalid LayerZero endpoint");
        
        scrollCoin = IERC20(_scrollCoin);
        lzEndpoint = _lzEndpoint;
        
        // Initialize supported chains (examples)
        supportedChains[1] = true;  // Ethereum
        supportedChains[56] = true; // BSC
        supportedChains[137] = true; // Polygon
        supportedChains[43114] = true; // Avalanche
    }
    
    /**
     * @notice Bridge tokens to another chain
     * @param destinationChainId Target chain ID
     * @param recipient Address to receive tokens on destination chain
     * @param amount Amount of tokens to bridge
     */
    function bridgeTokens(
        uint16 destinationChainId,
        address recipient,
        uint256 amount
    ) external nonReentrant {
        require(supportedChains[destinationChainId], "Chain not supported");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        
        // Calculate fee
        uint256 fee = (amount * bridgeFee) / 10000;
        uint256 amountAfterFee = amount - fee;
        
        // Transfer tokens from sender to bridge
        require(
            scrollCoin.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Accumulate fees
        accumulatedFees += fee;
        
        emit BridgeInitiated(
            msg.sender,
            destinationChainId,
            recipient,
            amountAfterFee,
            fee
        );
        
        // In a real implementation, this would call LayerZero endpoint
        // _lzSend(destinationChainId, recipient, amountAfterFee);
    }
    
    /**
     * @notice Complete bridge transfer (called by LayerZero endpoint)
     * @param recipient Address to receive tokens
     * @param sourceChainId Source chain ID
     * @param amount Amount to transfer
     */
    function completeBridge(
        address recipient,
        uint16 sourceChainId,
        uint256 amount
    ) external {
        // In production, this should only be callable by LayerZero endpoint
        require(msg.sender == lzEndpoint, "Only LayerZero endpoint");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        require(scrollCoin.transfer(recipient, amount), "Transfer failed");
        
        emit BridgeCompleted(recipient, sourceChainId, amount);
    }
    
    /**
     * @notice Add or remove supported chain
     * @param chainId Chain ID to update
     * @param supported Whether chain is supported
     */
    function setSupportedChain(uint16 chainId, bool supported) external onlyOwner {
        supportedChains[chainId] = supported;
        emit ChainSupported(chainId, supported);
    }
    
    /**
     * @notice Update bridge fee
     * @param newFee New fee in basis points (max 1000 = 10%)
     */
    function setBridgeFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        bridgeFee = newFee;
        emit BridgeFeeUpdated(newFee);
    }
    
    /**
     * @notice Withdraw accumulated fees
     * @param to Address to receive fees
     */
    function withdrawFees(address to) external onlyOwner {
        require(to != address(0), "Invalid address");
        uint256 amount = accumulatedFees;
        accumulatedFees = 0;
        
        require(scrollCoin.transfer(to, amount), "Transfer failed");
        emit FeesWithdrawn(to, amount);
    }
    
    /**
     * @notice Update LayerZero endpoint
     * @param newEndpoint New endpoint address
     */
    function updateLzEndpoint(address newEndpoint) external onlyOwner {
        require(newEndpoint != address(0), "Invalid endpoint");
        lzEndpoint = newEndpoint;
    }
}
