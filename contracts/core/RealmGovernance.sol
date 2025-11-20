// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title RealmGovernance
 * @dev Decentralized governance for realm management and protocol upgrades
 * @notice Enables community-driven decision making for the OmniGambling Revolution
 * @author Chais Hill | Omnitech1
 */
contract RealmGovernance {
    
    // Proposal structure
    struct Proposal {
        uint256 proposalId;
        address proposer;
        string description;
        ProposalType proposalType;
        bytes executionData;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        ProposalStatus status;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voteWeight;
    }
    
    // Proposal types
    enum ProposalType {
        RealmRegistration,
        RealmDeactivation,
        FeeAdjustment,
        ValidatorChange,
        ProtocolUpgrade,
        EmergencyAction
    }
    
    // Proposal status
    enum ProposalStatus {
        Pending,
        Active,
        Succeeded,
        Failed,
        Executed,
        Cancelled
    }
    
    // Governance token balance tracking
    mapping(address => uint256) public votingPower;
    
    // Proposals mapping
    mapping(uint256 => Proposal) public proposals;
    
    // Proposal counter
    uint256 public proposalCounter;
    
    // Governance parameters
    uint256 public votingPeriod = 3 days;
    uint256 public proposalThreshold = 1000 * 10**18; // 1000 tokens
    uint256 public quorumPercentage = 10; // 10% of total voting power
    uint256 public totalVotingPower;
    
    // Admin address
    address public admin;
    
    // Bridge and registry contracts
    address public bridge;
    address public registry;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string description,
        ProposalType proposalType
    );
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event VotingPowerUpdated(address indexed account, uint256 newPower);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    constructor(address _bridge, address _registry) {
        admin = msg.sender;
        bridge = _bridge;
        registry = _registry;
        proposalCounter = 0;
    }
    
    /**
     * @dev Create a new proposal
     */
    function createProposal(
        string memory _description,
        ProposalType _proposalType,
        bytes memory _executionData
    ) external returns (uint256) {
        require(
            votingPower[msg.sender] >= proposalThreshold,
            "Insufficient voting power to propose"
        );
        
        proposalCounter++;
        
        Proposal storage newProposal = proposals[proposalCounter];
        newProposal.proposalId = proposalCounter;
        newProposal.proposer = msg.sender;
        newProposal.description = _description;
        newProposal.proposalType = _proposalType;
        newProposal.executionData = _executionData;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.startTime = block.timestamp;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.status = ProposalStatus.Active;
        
        emit ProposalCreated(
            proposalCounter,
            msg.sender,
            _description,
            _proposalType
        );
        
        return proposalCounter;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        uint256 weight = votingPower[msg.sender];
        proposal.hasVoted[msg.sender] = true;
        proposal.voteWeight[msg.sender] = weight;
        
        if (_support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, weight);
    }
    
    /**
     * @dev Finalize a proposal after voting period
     */
    function finalizeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes;
        uint256 quorum = (totalVotingPower * quorumPercentage) / 100;
        
        if (totalVotes >= quorum && proposal.forVotes > proposal.againstVotes) {
            proposal.status = ProposalStatus.Succeeded;
        } else {
            proposal.status = ProposalStatus.Failed;
        }
    }
    
    /**
     * @dev Execute a successful proposal
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.status == ProposalStatus.Succeeded, "Proposal not succeeded");
        
        // Execute based on proposal type
        if (proposal.proposalType == ProposalType.FeeAdjustment) {
            // Decode and execute fee adjustment
            (uint256 baseFee, uint256 intergalacticFee) = abi.decode(
                proposal.executionData,
                (uint256, uint256)
            );
            (bool success, ) = bridge.call(
                abi.encodeWithSignature("updateFees(uint256,uint256)", baseFee, intergalacticFee)
            );
            require(success, "Fee update failed");
        }
        // Add execution logic for other proposal types
        
        proposal.status = ProposalStatus.Executed;
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * @dev Cancel a proposal (admin only in emergencies)
     */
    function cancelProposal(uint256 _proposalId) external onlyAdmin {
        Proposal storage proposal = proposals[_proposalId];
        require(
            proposal.status == ProposalStatus.Active || 
            proposal.status == ProposalStatus.Succeeded,
            "Cannot cancel proposal in current state"
        );
        
        proposal.status = ProposalStatus.Cancelled;
        emit ProposalCancelled(_proposalId);
    }
    
    /**
     * @dev Update voting power (called by governance token contract)
     */
    function updateVotingPower(address _account, uint256 _newPower) external {
        // In production, this should be called by the governance token contract
        // For now, allow admin to set voting power
        require(msg.sender == admin, "Only admin can update voting power");
        
        uint256 oldPower = votingPower[_account];
        votingPower[_account] = _newPower;
        
        totalVotingPower = totalVotingPower - oldPower + _newPower;
        
        emit VotingPowerUpdated(_account, _newPower);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId) 
        external 
        view 
        returns (
            address proposer,
            string memory description,
            ProposalType proposalType,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 startTime,
            uint256 endTime,
            ProposalStatus status
        ) 
    {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.description,
            proposal.proposalType,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.startTime,
            proposal.endTime,
            proposal.status
        );
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     */
    function hasVoted(uint256 _proposalId, address _voter) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_voter];
    }
    
    /**
     * @dev Update governance parameters
     */
    function updateGovernanceParameters(
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumPercentage
    ) external onlyAdmin {
        votingPeriod = _votingPeriod;
        proposalThreshold = _proposalThreshold;
        quorumPercentage = _quorumPercentage;
    }
}
