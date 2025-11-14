// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title HonorNFTStaking
 * @dev Staking contract for Shield of Honor NFTs with governance voting rights
 */
contract HonorNFTStaking is Ownable, ReentrancyGuard {
    IERC721 public nftContract;
    IERC20 public rewardToken;
    
    struct StakeInfo {
        address owner;
        uint256 stakedAt;
        uint256 lastClaimTime;
    }
    
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // NFT tokenId => StakeInfo
    mapping(uint256 => StakeInfo) public stakes;
    
    // Address => staked token IDs
    mapping(address => uint256[]) public stakedTokens;
    
    // Proposals
    Proposal[] public proposals;
    
    // Reward rate per day (in wei)
    uint256 public rewardRatePerDay;
    
    // Minimum stake duration for voting (in seconds)
    uint256 public constant MIN_STAKE_FOR_VOTING = 7 days;
    
    // Proposal duration
    uint256 public constant PROPOSAL_DURATION = 7 days;
    
    event NFTStaked(address indexed user, uint256 indexed tokenId);
    event NFTUnstaked(address indexed user, uint256 indexed tokenId);
    event RewardsClaimed(address indexed user, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(
        address _nftContract,
        address _rewardToken,
        uint256 _rewardRatePerDay
    ) Ownable(msg.sender) {
        require(_nftContract != address(0), "NFT contract cannot be zero");
        require(_rewardToken != address(0), "Reward token cannot be zero");
        
        nftContract = IERC721(_nftContract);
        rewardToken = IERC20(_rewardToken);
        rewardRatePerDay = _rewardRatePerDay;
    }
    
    /**
     * @dev Stake an NFT
     */
    function stakeNFT(uint256 tokenId) external nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(stakes[tokenId].owner == address(0), "Already staked");
        
        // Transfer NFT to contract
        nftContract.transferFrom(msg.sender, address(this), tokenId);
        
        // Record stake
        stakes[tokenId] = StakeInfo({
            owner: msg.sender,
            stakedAt: block.timestamp,
            lastClaimTime: block.timestamp
        });
        
        stakedTokens[msg.sender].push(tokenId);
        
        emit NFTStaked(msg.sender, tokenId);
    }
    
    /**
     * @dev Unstake an NFT
     */
    function unstakeNFT(uint256 tokenId) external nonReentrant {
        StakeInfo memory stakeInfo = stakes[tokenId];
        require(stakeInfo.owner == msg.sender, "Not the staker");
        
        // Claim pending rewards
        _claimRewards(tokenId);
        
        // Transfer NFT back to owner
        nftContract.transferFrom(address(this), msg.sender, tokenId);
        
        // Remove from staked tokens
        _removeTokenFromStakedList(msg.sender, tokenId);
        
        // Clear stake info
        delete stakes[tokenId];
        
        emit NFTUnstaked(msg.sender, tokenId);
    }
    
    /**
     * @dev Claim rewards for a staked NFT
     */
    function claimRewards(uint256 tokenId) external nonReentrant {
        require(stakes[tokenId].owner == msg.sender, "Not the staker");
        _claimRewards(tokenId);
    }
    
    /**
     * @dev Internal function to claim rewards
     */
    function _claimRewards(uint256 tokenId) internal {
        StakeInfo storage stakeInfo = stakes[tokenId];
        uint256 rewards = calculateRewards(tokenId);
        
        if (rewards > 0) {
            stakeInfo.lastClaimTime = block.timestamp;
            require(rewardToken.transfer(stakeInfo.owner, rewards), "Reward transfer failed");
            emit RewardsClaimed(stakeInfo.owner, rewards);
        }
    }
    
    /**
     * @dev Calculate pending rewards for a staked NFT
     */
    function calculateRewards(uint256 tokenId) public view returns (uint256) {
        StakeInfo memory stakeInfo = stakes[tokenId];
        if (stakeInfo.owner == address(0)) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 rewards = (timeStaked * rewardRatePerDay) / 1 days;
        
        return rewards;
    }
    
    /**
     * @dev Create a governance proposal
     */
    function createProposal(string memory description) external onlyOwner returns (uint256) {
        proposals.push();
        uint256 proposalId = proposals.length - 1;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.description = description;
        proposal.endTime = block.timestamp + PROPOSAL_DURATION;
        proposal.executed = false;
        
        emit ProposalCreated(proposalId, description);
        return proposalId;
    }
    
    /**
     * @dev Vote on a proposal
     */
    function vote(uint256 proposalId, bool support) external {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // Check if user has staked NFTs for minimum duration
        uint256 votingPower = getVotingPower(msg.sender);
        require(votingPower > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (support) {
            proposal.votesFor += votingPower;
        } else {
            proposal.votesAgainst += votingPower;
        }
        
        emit VoteCast(proposalId, msg.sender, support);
    }
    
    /**
     * @dev Get voting power of an address
     */
    function getVotingPower(address user) public view returns (uint256) {
        uint256 power = 0;
        uint256[] memory tokens = stakedTokens[user];
        
        for (uint256 i = 0; i < tokens.length; i++) {
            StakeInfo memory stakeInfo = stakes[tokens[i]];
            if (block.timestamp >= stakeInfo.stakedAt + MIN_STAKE_FOR_VOTING) {
                power++;
            }
        }
        
        return power;
    }
    
    /**
     * @dev Execute a proposal (placeholder - implement specific logic)
     */
    function executeProposal(uint256 proposalId) external onlyOwner {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        
        proposal.executed = true;
        
        // Implement specific proposal logic here
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Get staked tokens for a user
     */
    function getStakedTokens(address user) external view returns (uint256[] memory) {
        return stakedTokens[user];
    }
    
    /**
     * @dev Get proposal count
     */
    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }
    
    /**
     * @dev Update reward rate
     */
    function setRewardRate(uint256 _rewardRatePerDay) external onlyOwner {
        rewardRatePerDay = _rewardRatePerDay;
    }
    
    /**
     * @dev Remove token from staked list
     */
    function _removeTokenFromStakedList(address user, uint256 tokenId) internal {
        uint256[] storage tokens = stakedTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
}
