const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ScrollCoin Token", function () {
  let scrollCoin;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const ScrollCoin = await ethers.getContractFactory("ScrollCoin");
    scrollCoin = await ScrollCoin.deploy(owner.address);
    await scrollCoin.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await scrollCoin.owner()).to.equal(owner.address);
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await scrollCoin.balanceOf(owner.address);
      const maxSupply = await scrollCoin.MAX_SUPPLY();
      expect(ownerBalance).to.equal(maxSupply.div(10)); // 10% initial supply
    });

    it("Should set the correct token name and symbol", async function () {
      expect(await scrollCoin.name()).to.equal("ScrollCoin");
      expect(await scrollCoin.symbol()).to.equal("SCROLL");
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await scrollCoin.mint(addr1.address, mintAmount);
      
      const balance = await scrollCoin.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await expect(
        scrollCoin.connect(addr1).mint(addr1.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should not allow minting beyond max supply", async function () {
      const maxSupply = await scrollCoin.MAX_SUPPLY();
      const currentMinted = await scrollCoin.totalMinted();
      const overAmount = maxSupply.sub(currentMinted).add(1);
      
      await expect(
        scrollCoin.mint(addr1.address, overAmount)
      ).to.be.revertedWith("ScrollCoin: Max supply exceeded");
    });
  });

  describe("Burning", function () {
    it("Should allow users to burn their tokens", async function () {
      const mintAmount = ethers.utils.parseEther("1000");
      await scrollCoin.mint(addr1.address, mintAmount);
      
      const burnAmount = ethers.utils.parseEther("500");
      await scrollCoin.connect(addr1).burn(burnAmount);
      
      const balance = await scrollCoin.balanceOf(addr1.address);
      expect(balance).to.equal(mintAmount.sub(burnAmount));
    });
  });

  describe("Pausable", function () {
    it("Should allow owner to pause transfers", async function () {
      await scrollCoin.pause();
      expect(await scrollCoin.paused()).to.equal(true);
    });

    it("Should prevent transfers when paused", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      await scrollCoin.pause();
      
      await expect(
        scrollCoin.transfer(addr1.address, transferAmount)
      ).to.be.revertedWith("Pausable: paused");
    });

    it("Should allow transfers after unpause", async function () {
      const transferAmount = ethers.utils.parseEther("100");
      await scrollCoin.pause();
      await scrollCoin.unpause();
      
      await scrollCoin.transfer(addr1.address, transferAmount);
      const balance = await scrollCoin.balanceOf(addr1.address);
      expect(balance).to.equal(transferAmount);
    });
  });

  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.utils.parseEther("50");
      await scrollCoin.transfer(addr1.address, transferAmount);
      
      const addr1Balance = await scrollCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await scrollCoin.balanceOf(owner.address);
      const tooMuch = initialOwnerBalance.add(1);
      
      await expect(
        scrollCoin.transfer(addr1.address, tooMuch)
      ).to.be.reverted;
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await scrollCoin.balanceOf(owner.address);
      const transferAmount = ethers.utils.parseEther("100");
      
      await scrollCoin.transfer(addr1.address, transferAmount);
      await scrollCoin.transfer(addr2.address, transferAmount);
      
      const finalOwnerBalance = await scrollCoin.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.sub(transferAmount.mul(2))
      );
      
      const addr1Balance = await scrollCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(transferAmount);
      
      const addr2Balance = await scrollCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });
  });
});
