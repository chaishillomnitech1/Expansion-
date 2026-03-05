const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HonorCoin", function () {
  let honorCoin;
  let owner, treasury, user1, user2;
  const INITIAL_SUPPLY = ethers.parseEther("1000000");
  const FEE_PERCENTAGE = 777n;
  const FEE_DENOMINATOR = 10000n;

  beforeEach(async function () {
    [owner, treasury, user1, user2] = await ethers.getSigners();

    const HonorCoin = await ethers.getContractFactory("HonorCoin");
    honorCoin = await HonorCoin.deploy(
      "HonorCoin",
      "HONOR",
      INITIAL_SUPPLY,
      treasury.address
    );
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await honorCoin.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await honorCoin.balanceOf(owner.address);
      expect(ownerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("Should set the treasury address", async function () {
      expect(await honorCoin.treasuryAddress()).to.equal(treasury.address);
    });

    it("Should exempt treasury and owner from fees", async function () {
      expect(await honorCoin.isExemptFromFees(treasury.address)).to.be.true;
      expect(await honorCoin.isExemptFromFees(owner.address)).to.be.true;
    });
  });

  describe("Transactions with fees", function () {
    it("Should apply 7.77% fee to transfers", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      // Transfer from owner to user1 (owner is exempt, so no fee)
      await honorCoin.transfer(user1.address, transferAmount);
      
      // Transfer from user1 to user2 (fee should apply)
      const expectedFee = (transferAmount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
      const expectedTransfer = transferAmount - expectedFee;
      
      await honorCoin.connect(user1).transfer(user2.address, transferAmount);
      
      const user2Balance = await honorCoin.balanceOf(user2.address);
      const treasuryBalance = await honorCoin.balanceOf(treasury.address);
      
      expect(user2Balance).to.equal(expectedTransfer);
      expect(treasuryBalance).to.equal(expectedFee);
    });

    it("Should track total fees collected", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await honorCoin.transfer(user1.address, transferAmount);
      await honorCoin.connect(user1).transfer(user2.address, transferAmount);
      
      const expectedFee = (transferAmount * FEE_PERCENTAGE) / FEE_DENOMINATOR;
      const totalFees = await honorCoin.totalFeesCollected();
      
      expect(totalFees).to.equal(expectedFee);
    });

    it("Should not apply fee when sender is exempt", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await honorCoin.transfer(user1.address, transferAmount);
      
      const user1Balance = await honorCoin.balanceOf(user1.address);
      expect(user1Balance).to.equal(transferAmount);
    });

    it("Should not apply fee when recipient is exempt", async function () {
      const transferAmount = ethers.parseEther("1000");
      
      await honorCoin.transfer(user1.address, transferAmount);
      await honorCoin.connect(user1).transfer(treasury.address, transferAmount);
      
      const treasuryBalance = await honorCoin.balanceOf(treasury.address);
      expect(treasuryBalance).to.equal(transferAmount);
    });
  });

  describe("Treasury management", function () {
    it("Should allow owner to update treasury address", async function () {
      await honorCoin.setTreasuryAddress(user1.address);
      expect(await honorCoin.treasuryAddress()).to.equal(user1.address);
    });

    it("Should update exemptions when treasury changes", async function () {
      await honorCoin.setTreasuryAddress(user1.address);
      
      expect(await honorCoin.isExemptFromFees(treasury.address)).to.be.false;
      expect(await honorCoin.isExemptFromFees(user1.address)).to.be.true;
    });

    it("Should not allow setting zero address as treasury", async function () {
      await expect(
        honorCoin.setTreasuryAddress(ethers.ZeroAddress)
      ).to.be.revertedWith("Treasury address cannot be zero");
    });

    it("Should not allow non-owner to update treasury", async function () {
      await expect(
        honorCoin.connect(user1).setTreasuryAddress(user2.address)
      ).to.be.reverted;
    });
  });

  describe("Fee exemptions", function () {
    it("Should allow owner to set fee exemption", async function () {
      await honorCoin.setFeeExemption(user1.address, true);
      expect(await honorCoin.isExemptFromFees(user1.address)).to.be.true;
    });

    it("Should allow owner to remove fee exemption", async function () {
      await honorCoin.setFeeExemption(user1.address, true);
      await honorCoin.setFeeExemption(user1.address, false);
      expect(await honorCoin.isExemptFromFees(user1.address)).to.be.false;
    });

    it("Should not allow non-owner to set exemptions", async function () {
      await expect(
        honorCoin.connect(user1).setFeeExemption(user2.address, true)
      ).to.be.reverted;
    });
  });

  describe("View functions", function () {
    it("Should return correct fee percentage", async function () {
      const [numerator, denominator] = await honorCoin.getFeePercentage();
      expect(numerator).to.equal(FEE_PERCENTAGE);
      expect(denominator).to.equal(FEE_DENOMINATOR);
    });
  });
});
