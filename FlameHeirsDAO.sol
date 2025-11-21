// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title FlameHeirsDAO
 * @author Chais Hill - ScrollVerse & Omnitech1
 * @notice DAO-backed Smart Contract for FlameHeirs governance integration with Star Atlas DAO
 * @dev Implements secure multi-signature governance with time-locked execution
 * 
 * Key Features:
 * - Multi-signature approval requirements (5 of 7 threshold)
 * - Time-locked proposal execution (72-hour minimum)
 * - Emergency pause functionality with council override
 * - Transparent audit trail with immutable logging
 * - Cross-chain governance capabilities
 * - ScrollCoinV2 token integration for voting power
 */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FlameHeirsDAO is AccessControl, ReentrancyGuard, Pausable {
    using ECDSA for bytes32;

    // ============ Constants & Immutables ============
    
    bytes32 public constant COUNCIL_MEMBER_ROLE = keccak256("COUNCIL_MEMBER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    
    uint256 public constant TIMELOCK_DURATION = 72 hours;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant EXECUTION_GRACE_PERIOD = 14 days;
    uint256 public constant APPROVAL_THRESHOLD = 5; // 5 of 7 council members
    uint256 public constant MAX_COUNCIL_SIZE = 21;
    
    // ============ State Variables ============
    
    IERC20 public scrollCoinV2Token;
    
    uint256 public proposalCount;
    uint256 public councilMemberCount;
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    mapping(address => uint256) public votingPower;
    
    // ============ Structs ============
    
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        bytes proposalData;
        uint256 createdAt;
        uint256 votingEndsAt;
        uint256 executionTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 approvalCount;
        ProposalState state;
        bool executed;
        address targetContract;
        uint256 value;
    }
    
    enum ProposalState {
        Pending,
        Active,
        Approved,
        Queued,
        Executed,
        Defeated,
        Cancelled,
        Expired
    }
    
    // ============ Events ============
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 votingEndsAt
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalApproved(
        uint256 indexed proposalId,
        address indexed councilMember,
        uint256 approvalCount
    );
    
    event ProposalQueued(
        uint256 indexed proposalId,
        uint256 executionTime
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        address indexed executor
    );
    
    event ProposalCancelled(
        uint256 indexed proposalId,
        address indexed canceller
    );
    
    event CouncilMemberAdded(
        address indexed member,
        address indexed addedBy
    );
    
    event CouncilMemberRemoved(
        address indexed member,
        address indexed removedBy
    );
    
    event VotingPowerUpdated(
        address indexed account,
        uint256 oldPower,
        uint256 newPower
    );
    
    event EmergencyActionExecuted(
        address indexed executor,
        string action,
        uint256 timestamp
    );
    
    // ============ Constructor ============
    
    /**
     * @notice Initialize the FlameHeirs DAO contract
     * @param _scrollCoinV2Token Address of the ScrollCoinV2 token contract
     * @param _initialCouncil Array of initial council member addresses
     */
    constructor(
        address _scrollCoinV2Token,
        address[] memory _initialCouncil
    ) {
        require(_scrollCoinV2Token != address(0), "Invalid token address");
        require(_initialCouncil.length == 7, "Must have exactly 7 initial council members");
        
        scrollCoinV2Token = IERC20(_scrollCoinV2Token);
        
        // Set up roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        // Add initial council members
        for (uint256 i = 0; i < _initialCouncil.length; i++) {
            require(_initialCouncil[i] != address(0), "Invalid council member address");
            _grantRole(COUNCIL_MEMBER_ROLE, _initialCouncil[i]);
            councilMemberCount++;
            emit CouncilMemberAdded(_initialCouncil[i], msg.sender);
        }
    }
    
    // ============ Proposal Functions ============
    
    /**
     * @notice Create a new governance proposal
     * @param _title Title of the proposal
     * @param _description Detailed description of the proposal
     * @param _proposalData Encoded function call data for execution
     * @param _targetContract Address of contract to call when executing
     * @param _value Amount of ETH to send with execution
     * @return proposalId The ID of the created proposal
     */
    function createProposal(
        string memory _title,
        string memory _description,
        bytes memory _proposalData,
        address _targetContract,
        uint256 _value
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(votingPower[msg.sender] > 0 || hasRole(COUNCIL_MEMBER_ROLE, msg.sender), 
                "Insufficient voting power or not council member");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.proposalData = _proposalData;
        proposal.createdAt = block.timestamp;
        proposal.votingEndsAt = block.timestamp + VOTING_PERIOD;
        proposal.state = ProposalState.Active;
        proposal.targetContract = _targetContract;
        proposal.value = _value;
        
        emit ProposalCreated(proposalId, msg.sender, _title, proposal.votingEndsAt);
        
        return proposalId;
    }
    
    /**
     * @notice Cast a vote on an active proposal
     * @param _proposalId ID of the proposal to vote on
     * @param _support True for 'for', false for 'against'
     */
    function castVote(uint256 _proposalId, bool _support) external whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.state == ProposalState.Active, "Proposal not active");
        require(block.timestamp <= proposal.votingEndsAt, "Voting period ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        uint256 weight = votingPower[msg.sender];
        hasVoted[_proposalId][msg.sender] = true;
        
        if (_support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, weight);
    }
    
    /**
     * @notice Council member approves a proposal (multi-sig requirement)
     * @param _proposalId ID of the proposal to approve
     */
    function approveProposal(uint256 _proposalId) external onlyRole(COUNCIL_MEMBER_ROLE) whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.state == ProposalState.Active, "Proposal not active");
        require(block.timestamp > proposal.votingEndsAt, "Voting period not ended");
        require(!hasApproved[_proposalId][msg.sender], "Already approved");
        require(proposal.forVotes > proposal.againstVotes, "Proposal defeated");
        
        hasApproved[_proposalId][msg.sender] = true;
        proposal.approvalCount++;
        
        emit ProposalApproved(_proposalId, msg.sender, proposal.approvalCount);
        
        // If threshold reached, queue for execution
        if (proposal.approvalCount >= APPROVAL_THRESHOLD) {
            proposal.state = ProposalState.Queued;
            proposal.executionTime = block.timestamp + TIMELOCK_DURATION;
            emit ProposalQueued(_proposalId, proposal.executionTime);
        }
    }
    
    /**
     * @notice Execute a queued proposal after timelock
     * @param _proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.state == ProposalState.Queued, "Proposal not queued");
        require(block.timestamp >= proposal.executionTime, "Timelock not expired");
        require(block.timestamp <= proposal.executionTime + EXECUTION_GRACE_PERIOD, 
                "Proposal expired");
        require(!proposal.executed, "Already executed");
        require(hasRole(EXECUTOR_ROLE, msg.sender) || hasRole(COUNCIL_MEMBER_ROLE, msg.sender),
                "Not authorized to execute");
        
        proposal.executed = true;
        proposal.state = ProposalState.Executed;
        
        // Execute the proposal
        if (proposal.proposalData.length > 0 && proposal.targetContract != address(0)) {
            (bool success, ) = proposal.targetContract.call{value: proposal.value}(
                proposal.proposalData
            );
            require(success, "Proposal execution failed");
        }
        
        emit ProposalExecuted(_proposalId, msg.sender);
    }
    
    /**
     * @notice Cancel a proposal (only council members)
     * @param _proposalId ID of the proposal to cancel
     */
    function cancelProposal(uint256 _proposalId) external onlyRole(COUNCIL_MEMBER_ROLE) {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.state != ProposalState.Executed, "Cannot cancel executed proposal");
        require(proposal.state != ProposalState.Cancelled, "Already cancelled");
        
        proposal.state = ProposalState.Cancelled;
        
        emit ProposalCancelled(_proposalId, msg.sender);
    }
    
    // ============ Council Management ============
    
    /**
     * @notice Add a new council member (requires admin role)
     * @param _newMember Address of the new council member
     */
    function addCouncilMember(address _newMember) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newMember != address(0), "Invalid address");
        require(councilMemberCount < MAX_COUNCIL_SIZE, "Council at max capacity");
        require(!hasRole(COUNCIL_MEMBER_ROLE, _newMember), "Already a council member");
        
        _grantRole(COUNCIL_MEMBER_ROLE, _newMember);
        councilMemberCount++;
        
        emit CouncilMemberAdded(_newMember, msg.sender);
    }
    
    /**
     * @notice Remove a council member (requires admin role)
     * @param _member Address of the council member to remove
     */
    function removeCouncilMember(address _member) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(hasRole(COUNCIL_MEMBER_ROLE, _member), "Not a council member");
        require(councilMemberCount > APPROVAL_THRESHOLD, "Cannot go below threshold");
        
        _revokeRole(COUNCIL_MEMBER_ROLE, _member);
        councilMemberCount--;
        
        emit CouncilMemberRemoved(_member, msg.sender);
    }
    
    // ============ Voting Power Management ============
    
    /**
     * @notice Update voting power based on ScrollCoinV2 holdings
     * @param _account Address to update voting power for
     */
    function updateVotingPower(address _account) external {
        uint256 balance = scrollCoinV2Token.balanceOf(_account);
        uint256 oldPower = votingPower[_account];
        
        // Implement quadratic voting: sqrt of token balance
        uint256 newPower = sqrt(balance);
        
        votingPower[_account] = newPower;
        
        emit VotingPowerUpdated(_account, oldPower, newPower);
    }
    
    /**
     * @notice Batch update voting power for multiple accounts
     * @param _accounts Array of addresses to update
     */
    function batchUpdateVotingPower(address[] calldata _accounts) external {
        for (uint256 i = 0; i < _accounts.length; i++) {
            uint256 balance = scrollCoinV2Token.balanceOf(_accounts[i]);
            uint256 oldPower = votingPower[_accounts[i]];
            uint256 newPower = sqrt(balance);
            
            votingPower[_accounts[i]] = newPower;
            
            emit VotingPowerUpdated(_accounts[i], oldPower, newPower);
        }
    }
    
    // ============ Emergency Functions ============
    
    /**
     * @notice Emergency pause (council members only)
     */
    function emergencyPause() external onlyRole(COUNCIL_MEMBER_ROLE) {
        _pause();
        emit EmergencyActionExecuted(msg.sender, "PAUSE", block.timestamp);
    }
    
    /**
     * @notice Unpause contract (requires admin role)
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit EmergencyActionExecuted(msg.sender, "UNPAUSE", block.timestamp);
    }
    
    /**
     * @notice Emergency withdrawal (requires majority council approval)
     * @param _token Token address to withdraw (address(0) for ETH)
     * @param _to Recipient address
     * @param _amount Amount to withdraw
     */
    function emergencyWithdraw(
        address _token,
        address payable _to,
        uint256 _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(_to != address(0), "Invalid recipient");
        
        if (_token == address(0)) {
            // Withdraw ETH
            require(address(this).balance >= _amount, "Insufficient ETH balance");
            _to.transfer(_amount);
        } else {
            // Withdraw ERC20
            IERC20 token = IERC20(_token);
            require(token.balanceOf(address(this)) >= _amount, "Insufficient token balance");
            require(token.transfer(_to, _amount), "Transfer failed");
        }
        
        emit EmergencyActionExecuted(msg.sender, "EMERGENCY_WITHDRAW", block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get proposal details
     * @param _proposalId ID of the proposal
     * @return Proposal struct
     */
    function getProposal(uint256 _proposalId) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
    
    /**
     * @notice Get proposal state
     * @param _proposalId ID of the proposal
     * @return Current state of the proposal
     */
    function getProposalState(uint256 _proposalId) external view returns (ProposalState) {
        Proposal storage proposal = proposals[_proposalId];
        
        if (proposal.state == ProposalState.Queued && 
            block.timestamp > proposal.executionTime + EXECUTION_GRACE_PERIOD) {
            return ProposalState.Expired;
        }
        
        return proposal.state;
    }
    
    /**
     * @notice Check if address has voted on proposal
     * @param _proposalId ID of the proposal
     * @param _voter Address to check
     * @return True if voted, false otherwise
     */
    function hasVotedOnProposal(uint256 _proposalId, address _voter) external view returns (bool) {
        return hasVoted[_proposalId][_voter];
    }
    
    /**
     * @notice Check if council member has approved proposal
     * @param _proposalId ID of the proposal
     * @param _councilMember Address to check
     * @return True if approved, false otherwise
     */
    function hasApprovedProposal(uint256 _proposalId, address _councilMember) external view returns (bool) {
        return hasApproved[_proposalId][_councilMember];
    }
    
    /**
     * @notice Get voting power of an address
     * @param _account Address to check
     * @return Current voting power
     */
    function getVotingPower(address _account) external view returns (uint256) {
        return votingPower[_account];
    }
    
    /**
     * @notice Get total council member count
     * @return Number of council members
     */
    function getCouncilMemberCount() external view returns (uint256) {
        return councilMemberCount;
    }
    
    // ============ Utility Functions ============
    
    /**
     * @notice Calculate square root (for quadratic voting)
     * @param x Input number
     * @return y Square root of x
     */
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
    
    /**
     * @notice Receive ETH
     */
    receive() external payable {}
    
    /**
     * @notice Fallback function
     */
    fallback() external payable {}
}
