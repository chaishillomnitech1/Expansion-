const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OmniGamblingMarketplace", function () {
  let honorCoin, marketplace, testNFT;
  let owner, seller, buyer, beneficiary;
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, seller, buyer, beneficiary] = await ethers.getSigners();

    // Deploy HonorCoin
    const HonorCoin = await ethers.getContractFactory("HonorCoin");
    honorCoin = await HonorCoin.deploy(
      "HonorCoin",
      "HONOR",
      INITIAL_SUPPLY,
      owner.address
    );

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("OmniGamblingMarketplace");
    marketplace = await Marketplace.deploy(await honorCoin.getAddress());

    // Deploy Test NFT
    const TestNFT = await ethers.getContractFactory("TestNFT");
    testNFT = await TestNFT.deploy();

    // Mint NFT to seller
    await testNFT.mint(seller.address);

    // Distribute tokens
    await honorCoin.transfer(buyer.address, ethers.parseEther("10000"));
  });

  describe("Deployment", function () {
    it("Should set the correct payment token", async function () {
      expect(await marketplace.paymentToken()).to.equal(await honorCoin.getAddress());
    });

    it("Should set default marketplace fee", async function () {
      expect(await marketplace.marketplaceFee()).to.equal(250);
    });

    it("Should set default suggested donation percentage", async function () {
      expect(await marketplace.suggestedDonationPercentage()).to.equal(500);
    });
  });

  describe("Listing management", function () {
    it("Should allow NFT owner to list", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await testNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);
      await marketplace.connect(seller).listNFT(
        await testNFT.getAddress(),
        tokenId,
        price
      );

      const listing = await marketplace.getListing(await testNFT.getAddress(), tokenId);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.price).to.equal(price);
      expect(listing.active).to.be.true;
    });

    it("Should not allow listing without approval", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await expect(
        marketplace.connect(seller).listNFT(
          await testNFT.getAddress(),
          tokenId,
          price
        )
      ).to.be.revertedWith("Contract not approved");
    });

    it("Should allow seller to unlist", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await testNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);
      await marketplace.connect(seller).listNFT(
        await testNFT.getAddress(),
        tokenId,
        price
      );

      await marketplace.connect(seller).unlistNFT(
        await testNFT.getAddress(),
        tokenId
      );

      const listing = await marketplace.getListing(await testNFT.getAddress(), tokenId);
      expect(listing.active).to.be.false;
    });
  });

  describe("Purchasing", function () {
    beforeEach(async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await testNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);
      await marketplace.connect(seller).listNFT(
        await testNFT.getAddress(),
        tokenId,
        price
      );
    });

    it("Should allow purchase without donation", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), price);
      await marketplace.connect(buyer).purchaseNFT(
        await testNFT.getAddress(),
        tokenId,
        0,
        0
      );

      expect(await testNFT.ownerOf(tokenId)).to.equal(buyer.address);
    });

    it("Should apply marketplace fee correctly", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");
      const fee = (price * 250n) / 10000n; // 2.5%
      const sellerAmount = price - fee;

      const sellerBalanceBefore = await honorCoin.balanceOf(seller.address);

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), price);
      await marketplace.connect(buyer).purchaseNFT(
        await testNFT.getAddress(),
        tokenId,
        0,
        0
      );

      const sellerBalanceAfter = await honorCoin.balanceOf(seller.address);
      expect(sellerBalanceAfter - sellerBalanceBefore).to.equal(sellerAmount);
    });

    it("Should handle purchase with donation", async function () {
      // Create a charitable cause
      await marketplace.createCause("Test Cause", beneficiary.address);

      const tokenId = 0;
      const price = ethers.parseEther("100");
      const donationAmount = ethers.parseEther("10");
      const totalAmount = price + donationAmount;

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), totalAmount);
      await marketplace.connect(buyer).purchaseNFT(
        await testNFT.getAddress(),
        tokenId,
        donationAmount,
        0
      );

      const beneficiaryBalance = await honorCoin.balanceOf(beneficiary.address);
      expect(beneficiaryBalance).to.equal(donationAmount);
    });

    it("Should mark listing as inactive after purchase", async function () {
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), price);
      await marketplace.connect(buyer).purchaseNFT(
        await testNFT.getAddress(),
        tokenId,
        0,
        0
      );

      const listing = await marketplace.getListing(await testNFT.getAddress(), tokenId);
      expect(listing.active).to.be.false;
    });
  });

  describe("Charitable causes", function () {
    it("Should allow owner to create cause", async function () {
      await marketplace.createCause("Test Cause", beneficiary.address);
      
      const cause = await marketplace.charitableCauses(0);
      expect(cause.name).to.equal("Test Cause");
      expect(cause.beneficiary).to.equal(beneficiary.address);
      expect(cause.active).to.be.true;
    });

    it("Should not allow non-owner to create cause", async function () {
      await expect(
        marketplace.connect(buyer).createCause("Test Cause", beneficiary.address)
      ).to.be.reverted;
    });

    it("Should return correct cause count", async function () {
      await marketplace.createCause("Cause 1", beneficiary.address);
      await marketplace.createCause("Cause 2", beneficiary.address);
      
      expect(await marketplace.getCauseCount()).to.equal(2);
    });

    it("Should allow updating cause status", async function () {
      await marketplace.createCause("Test Cause", beneficiary.address);
      await marketplace.updateCauseStatus(0, false);
      
      const cause = await marketplace.charitableCauses(0);
      expect(cause.active).to.be.false;
    });
  });

  describe("Direct donations", function () {
    beforeEach(async function () {
      await marketplace.createCause("Test Cause", beneficiary.address);
    });

    it("Should allow direct donations", async function () {
      const donationAmount = ethers.parseEther("50");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), donationAmount);
      await marketplace.connect(buyer).makeDonation(0, donationAmount);

      const beneficiaryBalance = await honorCoin.balanceOf(beneficiary.address);
      expect(beneficiaryBalance).to.equal(donationAmount);
    });

    it("Should track total donations per cause", async function () {
      const donationAmount = ethers.parseEther("50");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), donationAmount);
      await marketplace.connect(buyer).makeDonation(0, donationAmount);

      const cause = await marketplace.charitableCauses(0);
      expect(cause.totalDonations).to.equal(donationAmount);
    });

    it("Should track user donations per cause", async function () {
      const donationAmount = ethers.parseEther("50");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), donationAmount);
      await marketplace.connect(buyer).makeDonation(0, donationAmount);

      const userDonation = await marketplace.getUserDonations(buyer.address, 0);
      expect(userDonation).to.equal(donationAmount);
    });

    it("Should create donation NFT record", async function () {
      const donationAmount = ethers.parseEther("50");

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), donationAmount);
      await marketplace.connect(buyer).makeDonation(0, donationAmount);

      const donationNFT = await marketplace.donationNFTs(0);
      expect(donationNFT.donor).to.equal(buyer.address);
      expect(donationNFT.amount).to.equal(donationAmount);
      expect(donationNFT.causeId).to.equal(0);
    });

    it("Should not allow donation to inactive cause", async function () {
      await marketplace.updateCauseStatus(0, false);

      const donationAmount = ethers.parseEther("50");
      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), donationAmount);

      await expect(
        marketplace.connect(buyer).makeDonation(0, donationAmount)
      ).to.be.revertedWith("Cause not active");
    });
  });

  describe("Fee management", function () {
    it("Should allow owner to update marketplace fee", async function () {
      await marketplace.setMarketplaceFee(500);
      expect(await marketplace.marketplaceFee()).to.equal(500);
    });

    it("Should not allow fee above 10%", async function () {
      await expect(
        marketplace.setMarketplaceFee(1001)
      ).to.be.revertedWith("Fee too high");
    });

    it("Should allow owner to withdraw fees", async function () {
      // Create a purchase to generate fees
      const tokenId = 0;
      const price = ethers.parseEther("100");

      await testNFT.connect(seller).approve(await marketplace.getAddress(), tokenId);
      await marketplace.connect(seller).listNFT(
        await testNFT.getAddress(),
        tokenId,
        price
      );

      await honorCoin.connect(buyer).approve(await marketplace.getAddress(), price);
      await marketplace.connect(buyer).purchaseNFT(
        await testNFT.getAddress(),
        tokenId,
        0,
        0
      );

      // Calculate fee
      const fee = (price * 250n) / 10000n;

      // Withdraw
      await marketplace.withdrawFees(owner.address, fee);

      const ownerBalance = await honorCoin.balanceOf(owner.address);
      expect(ownerBalance).to.be.gte(fee);
    });
  });
});
