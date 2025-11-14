const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShieldOfHonorTreasury", function () {
  let honorCoin, treasury;
  let owner, manager, beneficiary, user;
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, manager, beneficiary, user] = await ethers.getSigners();

    // Deploy HonorCoin
    const HonorCoin = await ethers.getContractFactory("HonorCoin");
    honorCoin = await HonorCoin.deploy(
      "HonorCoin",
      "HONOR",
      INITIAL_SUPPLY,
      owner.address
    );

    // Deploy Treasury
    const Treasury = await ethers.getContractFactory("ShieldOfHonorTreasury");
    treasury = await Treasury.deploy(await honorCoin.getAddress());

    // Update HonorCoin treasury to point to contract
    await honorCoin.setTreasuryAddress(await treasury.getAddress());

    // Grant roles
    const DISBURSEMENT_MANAGER_ROLE = await treasury.DISBURSEMENT_MANAGER_ROLE();
    await treasury.grantRole(DISBURSEMENT_MANAGER_ROLE, manager.address);
  });

  describe("Deployment", function () {
    it("Should set the correct HonorCoin address", async function () {
      expect(await treasury.honorCoin()).to.equal(await honorCoin.getAddress());
    });

    it("Should grant default admin role to owner", async function () {
      const DEFAULT_ADMIN_ROLE = await treasury.DEFAULT_ADMIN_ROLE();
      expect(await treasury.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Milestone management", function () {
    it("Should allow manager to create milestone", async function () {
      const description = "First milestone";
      const targetAmount = ethers.parseEther("10000");
      const disbursementAmount = ethers.parseEther("5000");

      await treasury.connect(manager).createMilestone(
        description,
        targetAmount,
        disbursementAmount,
        beneficiary.address
      );

      const milestone = await treasury.milestones(0);
      expect(milestone.description).to.equal(description);
      expect(milestone.targetAmount).to.equal(targetAmount);
      expect(milestone.disbursementAmount).to.equal(disbursementAmount);
      expect(milestone.beneficiary).to.equal(beneficiary.address);
      expect(milestone.completed).to.be.false;
    });

    it("Should not allow non-manager to create milestone", async function () {
      await expect(
        treasury.connect(user).createMilestone(
          "Milestone",
          ethers.parseEther("1000"),
          ethers.parseEther("500"),
          beneficiary.address
        )
      ).to.be.reverted;
    });

    it("Should return correct milestone count", async function () {
      await treasury.connect(manager).createMilestone(
        "Milestone 1",
        ethers.parseEther("1000"),
        ethers.parseEther("500"),
        beneficiary.address
      );

      await treasury.connect(manager).createMilestone(
        "Milestone 2",
        ethers.parseEther("2000"),
        ethers.parseEther("1000"),
        beneficiary.address
      );

      expect(await treasury.getMilestoneCount()).to.equal(2);
    });
  });

  describe("Fund management", function () {
    it("Should receive funds", async function () {
      const amount = ethers.parseEther("1000");
      
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      const balance = await treasury.getTreasuryBalance();
      expect(balance).to.equal(amount);
    });

    it("Should allow manager to disburse funds", async function () {
      const amount = ethers.parseEther("1000");
      
      // Fund treasury
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      // Disburse
      const disbursementAmount = ethers.parseEther("500");
      await treasury.connect(manager).disburseFunds(
        beneficiary.address,
        disbursementAmount,
        "Community support"
      );
      
      const beneficiaryBalance = await honorCoin.balanceOf(beneficiary.address);
      expect(beneficiaryBalance).to.equal(disbursementAmount);
    });

    it("Should track total disbursed", async function () {
      const amount = ethers.parseEther("1000");
      
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      const disbursementAmount = ethers.parseEther("500");
      await treasury.connect(manager).disburseFunds(
        beneficiary.address,
        disbursementAmount,
        "Community support"
      );
      
      expect(await treasury.totalDisbursed()).to.equal(disbursementAmount);
    });

    it("Should not allow disbursement with insufficient balance", async function () {
      await expect(
        treasury.connect(manager).disburseFunds(
          beneficiary.address,
          ethers.parseEther("1000"),
          "Test"
        )
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Milestone completion", function () {
    beforeEach(async function () {
      // Create a milestone
      await treasury.connect(manager).createMilestone(
        "Test Milestone",
        ethers.parseEther("1000"),
        ethers.parseEther("800"),
        beneficiary.address
      );
    });

    it("Should complete milestone when target reached", async function () {
      // Fund treasury to reach target
      const amount = ethers.parseEther("1500");
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      // Complete milestone
      await treasury.connect(manager).completeMilestone(0);
      
      const milestone = await treasury.milestones(0);
      expect(milestone.completed).to.be.true;
      expect(milestone.completedAt).to.be.gt(0);
      
      const beneficiaryBalance = await honorCoin.balanceOf(beneficiary.address);
      expect(beneficiaryBalance).to.equal(ethers.parseEther("800"));
    });

    it("Should not complete milestone without sufficient funds", async function () {
      const amount = ethers.parseEther("500");
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      await expect(
        treasury.connect(manager).completeMilestone(0)
      ).to.be.revertedWith("Insufficient balance to complete milestone");
    });

    it("Should not complete already completed milestone", async function () {
      const amount = ethers.parseEther("1500");
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      await treasury.connect(manager).completeMilestone(0);
      
      await expect(
        treasury.connect(manager).completeMilestone(0)
      ).to.be.revertedWith("Milestone already completed");
    });
  });

  describe("Audit trail", function () {
    it("Should create audit records", async function () {
      const amount = ethers.parseEther("1000");
      
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      const auditLength = await treasury.getAuditTrailLength();
      expect(auditLength).to.be.gt(0);
    });

    it("Should emit audit record events", async function () {
      const amount = ethers.parseEther("1000");
      
      await honorCoin.approve(await treasury.getAddress(), amount);
      
      await expect(treasury.receiveFunds(amount))
        .to.emit(treasury, "AuditRecordCreated");
    });
  });

  describe("Chainlink Automation", function () {
    it("Should detect when milestone is ready via checkUpkeep", async function () {
      // Create milestone
      await treasury.connect(manager).createMilestone(
        "Auto Milestone",
        ethers.parseEther("1000"),
        ethers.parseEther("800"),
        beneficiary.address
      );
      
      // Fund treasury
      const amount = ethers.parseEther("1500");
      await honorCoin.approve(await treasury.getAddress(), amount);
      await treasury.receiveFunds(amount);
      
      const [upkeepNeeded, performData] = await treasury.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.true;
    });

    it("Should not need upkeep when no milestones ready", async function () {
      await treasury.connect(manager).createMilestone(
        "Future Milestone",
        ethers.parseEther("10000"),
        ethers.parseEther("8000"),
        beneficiary.address
      );
      
      const [upkeepNeeded] = await treasury.checkUpkeep("0x");
      expect(upkeepNeeded).to.be.false;
    });
  });
});
