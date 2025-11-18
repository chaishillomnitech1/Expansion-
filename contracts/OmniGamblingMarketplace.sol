// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title OmniGamblingMarketplace
 * @dev NFT Marketplace with integrated philanthropic donation mechanisms
 * Users can channel portions of gambling rewards to charitable causes
 */
contract OmniGamblingMarketplace is Ownable, ReentrancyGuard {
    
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }
    
    struct CharitableCause {
        string name;
        address beneficiary;
        uint256 totalDonations;
        bool active;
    }
    
    struct DonationNFT {
        address donor;
        uint256 amount;
        uint256 causeId;
        uint256 timestamp;
    }
    
    // Payment token (e.g., HonorCoin)
    IERC20 public paymentToken;
    
    // Listings
    mapping(bytes32 => Listing) public listings;
    
    // Charitable causes
    CharitableCause[] public charitableCauses;
    
    // Donation tracking NFTs
    DonationNFT[] public donationNFTs;
    
    // User donation amounts per cause
    mapping(address => mapping(uint256 => uint256)) public userDonations;
    
    // Marketplace fee (in basis points, e.g., 250 = 2.5%)
    uint256 public marketplaceFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // Optional donation percentage on purchases
    uint256 public suggestedDonationPercentage = 500; // 5%
    
    // Total donations tracked
    uint256 public totalDonations;
    
    // Events
    event Listed(address indexed seller, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event Unlisted(address indexed seller, address indexed nftContract, uint256 indexed tokenId);
    event Purchased(address indexed buyer, address indexed nftContract, uint256 indexed tokenId, uint256 price);
    event DonationMade(address indexed donor, uint256 indexed causeId, uint256 amount, uint256 nftId);
    event CauseCreated(uint256 indexed causeId, string name, address beneficiary);
    event CauseUpdated(uint256 indexed causeId, bool active);
    
    constructor(address _paymentToken) Ownable(msg.sender) {
        require(_paymentToken != address(0), "Payment token cannot be zero");
        paymentToken = IERC20(_paymentToken);
    }
    
    /**
     * @dev List an NFT for sale
     */
    function listNFT(address nftContract, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not the owner");
        require(IERC721(nftContract).isApprovedForAll(msg.sender, address(this)) || 
                IERC721(nftContract).getApproved(tokenId) == address(this), 
                "Contract not approved");
        
        bytes32 listingId = keccak256(abi.encodePacked(nftContract, tokenId));
        require(!listings[listingId].active, "Already listed");
        
        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            active: true
        });
        
        emit Listed(msg.sender, nftContract, tokenId, price);
    }
    
    /**
     * @dev Unlist an NFT
     */
    function unlistNFT(address nftContract, uint256 tokenId) external {
        bytes32 listingId = keccak256(abi.encodePacked(nftContract, tokenId));
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Not listed");
        require(listing.seller == msg.sender, "Not the seller");
        
        listing.active = false;
        
        emit Unlisted(msg.sender, nftContract, tokenId);
    }
    
    /**
     * @dev Purchase an NFT with optional donation
     */
    function purchaseNFT(
        address nftContract,
        uint256 tokenId,
        uint256 donationAmount,
        uint256 causeId
    ) external nonReentrant {
        bytes32 listingId = keccak256(abi.encodePacked(nftContract, tokenId));
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Not listed");
        require(IERC721(nftContract).ownerOf(tokenId) == listing.seller, "Seller no longer owns NFT");
        
        uint256 totalAmount = listing.price + donationAmount;
        
        // Calculate marketplace fee
        uint256 fee = (listing.price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - fee;
        
        // Transfer payment token from buyer
        require(paymentToken.transferFrom(msg.sender, address(this), totalAmount), "Payment failed");
        
        // Transfer to seller
        require(paymentToken.transfer(listing.seller, sellerAmount), "Seller payment failed");
        
        // Keep marketplace fee in contract (can be withdrawn by owner)
        
        // Process donation if specified
        if (donationAmount > 0 && causeId < charitableCauses.length) {
            _processDonation(msg.sender, causeId, donationAmount);
        }
        
        // Transfer NFT to buyer
        IERC721(nftContract).transferFrom(listing.seller, msg.sender, tokenId);
        
        // Mark as inactive
        listing.active = false;
        
        emit Purchased(msg.sender, nftContract, tokenId, listing.price);
    }
    
    /**
     * @dev Make a direct donation to a cause
     */
    function makeDonation(uint256 causeId, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than zero");
        require(causeId < charitableCauses.length, "Invalid cause");
        require(charitableCauses[causeId].active, "Cause not active");
        
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        _processDonation(msg.sender, causeId, amount);
    }
    
    /**
     * @dev Internal function to process donation
     */
    function _processDonation(address donor, uint256 causeId, uint256 amount) internal {
        CharitableCause storage cause = charitableCauses[causeId];
        require(cause.active, "Cause not active");
        
        // Transfer to beneficiary
        require(paymentToken.transfer(cause.beneficiary, amount), "Donation transfer failed");
        
        // Update tracking
        cause.totalDonations += amount;
        userDonations[donor][causeId] += amount;
        totalDonations += amount;
        
        // Create donation NFT record
        donationNFTs.push(DonationNFT({
            donor: donor,
            amount: amount,
            causeId: causeId,
            timestamp: block.timestamp
        }));
        
        uint256 nftId = donationNFTs.length - 1;
        
        emit DonationMade(donor, causeId, amount, nftId);
    }
    
    /**
     * @dev Create a charitable cause
     */
    function createCause(string memory name, address beneficiary) external onlyOwner returns (uint256) {
        require(beneficiary != address(0), "Beneficiary cannot be zero");
        
        charitableCauses.push(CharitableCause({
            name: name,
            beneficiary: beneficiary,
            totalDonations: 0,
            active: true
        }));
        
        uint256 causeId = charitableCauses.length - 1;
        
        emit CauseCreated(causeId, name, beneficiary);
        return causeId;
    }
    
    /**
     * @dev Update cause status
     */
    function updateCauseStatus(uint256 causeId, bool active) external onlyOwner {
        require(causeId < charitableCauses.length, "Invalid cause");
        charitableCauses[causeId].active = active;
        emit CauseUpdated(causeId, active);
    }
    
    /**
     * @dev Set marketplace fee
     */
    function setMarketplaceFee(uint256 _fee) external onlyOwner {
        require(_fee <= 1000, "Fee too high"); // Max 10%
        marketplaceFee = _fee;
    }
    
    /**
     * @dev Set suggested donation percentage
     */
    function setSuggestedDonationPercentage(uint256 _percentage) external onlyOwner {
        require(_percentage <= 5000, "Percentage too high"); // Max 50%
        suggestedDonationPercentage = _percentage;
    }
    
    /**
     * @dev Withdraw accumulated fees
     */
    function withdrawFees(address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Recipient cannot be zero");
        require(paymentToken.transfer(recipient, amount), "Withdrawal failed");
    }
    
    /**
     * @dev Get listing info
     */
    function getListing(address nftContract, uint256 tokenId) external view returns (Listing memory) {
        bytes32 listingId = keccak256(abi.encodePacked(nftContract, tokenId));
        return listings[listingId];
    }
    
    /**
     * @dev Get cause count
     */
    function getCauseCount() external view returns (uint256) {
        return charitableCauses.length;
    }
    
    /**
     * @dev Get donation NFT count
     */
    function getDonationNFTCount() external view returns (uint256) {
        return donationNFTs.length;
    }
    
    /**
     * @dev Get user total donations for a cause
     */
    function getUserDonations(address user, uint256 causeId) external view returns (uint256) {
        return userDonations[user][causeId];
    }
}
