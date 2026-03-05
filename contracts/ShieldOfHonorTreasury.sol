// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

/**
 * @title ShieldOfHonorTreasury
 * @dev Treasury contract for the Shield of Honor™ Initiative
 * Manages ethical support fund with transparent audit trail and milestone-triggered disbursements
 */
contract ShieldOfHonorTreasury is AccessControl, ReentrancyGuard, AutomationCompatibleInterface {
    bytes32 public constant DISBURSEMENT_MANAGER_ROLE = keccak256("DISBURSEMENT_MANAGER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    struct Milestone {
        string description;
        uint256 targetAmount;
        uint256 disbursementAmount;
        address beneficiary;
        bool completed;
        uint256 completedAt;
    }
    
    struct AuditRecord {
        uint256 timestamp;
        string action;
        uint256 amount;
        address actor;
        string metadata;
    }
    
    // Token address
    IERC20 public honorCoin;
    
    // NFT contract for audit trail
    address public auditNFTContract;
    
    // Milestones
    Milestone[] public milestones;
    
    // Audit trail
    AuditRecord[] public auditTrail;
    
    // Total disbursed
    uint256 public totalDisbursed;
    
    // Events
    event MilestoneCreated(uint256 indexed milestoneId, string description, uint256 targetAmount);
    event MilestoneCompleted(uint256 indexed milestoneId, uint256 amount, address beneficiary);
    event FundsReceived(address indexed from, uint256 amount);
    event FundsDisbursed(address indexed to, uint256 amount, string purpose);
    event AuditRecordCreated(uint256 indexed recordId, string action);
    event AuditNFTContractUpdated(address indexed newContract);
    
    constructor(address _honorCoin) {
        require(_honorCoin != address(0), "HonorCoin address cannot be zero");
        honorCoin = IERC20(_honorCoin);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISBURSEMENT_MANAGER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new milestone
     */
    function createMilestone(
        string memory description,
        uint256 targetAmount,
        uint256 disbursementAmount,
        address beneficiary
    ) external onlyRole(DISBURSEMENT_MANAGER_ROLE) {
        require(beneficiary != address(0), "Beneficiary cannot be zero address");
        require(disbursementAmount > 0, "Disbursement amount must be greater than zero");
        
        milestones.push(Milestone({
            description: description,
            targetAmount: targetAmount,
            disbursementAmount: disbursementAmount,
            beneficiary: beneficiary,
            completed: false,
            completedAt: 0
        }));
        
        uint256 milestoneId = milestones.length - 1;
        _createAuditRecord("Milestone Created", 0, string(abi.encodePacked("Milestone ID: ", _uint2str(milestoneId))));
        
        emit MilestoneCreated(milestoneId, description, targetAmount);
    }
    
    /**
     * @dev Chainlink Automation: Check if upkeep is needed
     */
    function checkUpkeep(bytes calldata /* checkData */)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        uint256 currentBalance = honorCoin.balanceOf(address(this));
        
        // Check if any milestone is ready to be completed
        for (uint256 i = 0; i < milestones.length; i++) {
            if (!milestones[i].completed && currentBalance >= milestones[i].targetAmount) {
                upkeepNeeded = true;
                performData = abi.encode(i);
                break;
            }
        }
    }
    
    /**
     * @dev Chainlink Automation: Perform upkeep
     */
    function performUpkeep(bytes calldata performData) external override nonReentrant {
        uint256 milestoneId = abi.decode(performData, (uint256));
        _completeMilestone(milestoneId);
    }
    
    /**
     * @dev Manual milestone completion (backup to automation)
     */
    function completeMilestone(uint256 milestoneId) external onlyRole(DISBURSEMENT_MANAGER_ROLE) nonReentrant {
        _completeMilestone(milestoneId);
    }
    
    /**
     * @dev Internal function to complete milestone
     */
    function _completeMilestone(uint256 milestoneId) internal {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        Milestone storage milestone = milestones[milestoneId];
        require(!milestone.completed, "Milestone already completed");
        
        uint256 currentBalance = honorCoin.balanceOf(address(this));
        require(currentBalance >= milestone.targetAmount, "Insufficient balance to complete milestone");
        
        // Mark as completed
        milestone.completed = true;
        milestone.completedAt = block.timestamp;
        
        // Disburse funds
        require(honorCoin.transfer(milestone.beneficiary, milestone.disbursementAmount), "Transfer failed");
        totalDisbursed += milestone.disbursementAmount;
        
        _createAuditRecord(
            "Milestone Completed",
            milestone.disbursementAmount,
            string(abi.encodePacked("Milestone ID: ", _uint2str(milestoneId)))
        );
        
        emit MilestoneCompleted(milestoneId, milestone.disbursementAmount, milestone.beneficiary);
    }
    
    /**
     * @dev Receive function to accept HonorCoin fees
     */
    function receiveFunds(uint256 amount) external {
        require(honorCoin.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        _createAuditRecord("Funds Received", amount, "");
        emit FundsReceived(msg.sender, amount);
    }
    
    /**
     * @dev Disburse funds to beneficiary
     */
    function disburseFunds(address beneficiary, uint256 amount, string memory purpose)
        external
        onlyRole(DISBURSEMENT_MANAGER_ROLE)
        nonReentrant
    {
        require(beneficiary != address(0), "Beneficiary cannot be zero address");
        require(amount > 0, "Amount must be greater than zero");
        require(honorCoin.balanceOf(address(this)) >= amount, "Insufficient balance");
        
        require(honorCoin.transfer(beneficiary, amount), "Transfer failed");
        totalDisbursed += amount;
        
        _createAuditRecord("Funds Disbursed", amount, purpose);
        emit FundsDisbursed(beneficiary, amount, purpose);
    }
    
    /**
     * @dev Create audit record
     */
    function _createAuditRecord(string memory action, uint256 amount, string memory metadata) internal {
        auditTrail.push(AuditRecord({
            timestamp: block.timestamp,
            action: action,
            amount: amount,
            actor: msg.sender,
            metadata: metadata
        }));
        
        emit AuditRecordCreated(auditTrail.length - 1, action);
    }
    
    /**
     * @dev Set audit NFT contract
     */
    function setAuditNFTContract(address _auditNFTContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_auditNFTContract != address(0), "Contract address cannot be zero");
        auditNFTContract = _auditNFTContract;
        emit AuditNFTContractUpdated(_auditNFTContract);
    }
    
    /**
     * @dev Get milestone count
     */
    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }
    
    /**
     * @dev Get audit trail length
     */
    function getAuditTrailLength() external view returns (uint256) {
        return auditTrail.length;
    }
    
    /**
     * @dev Get treasury balance
     */
    function getTreasuryBalance() external view returns (uint256) {
        return honorCoin.balanceOf(address(this));
    }
    
    /**
     * @dev Convert uint to string (helper function)
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
