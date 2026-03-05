const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SovereignIdentityLock (SIL) Contract Tests", function () {
  let sil;
  let sovereign;
  let dao1;
  let dao2;
  let unauthorized;
  let scrollBondHash;

  beforeEach(async function () {
    // Get signers
    [sovereign, dao1, dao2, unauthorized] = await ethers.getSigners();

    // Generate initial ScrollBond hash
    scrollBondHash = ethers.keccak256(
      ethers.toUtf8Bytes("CHAIS THE GREAT ∞ - ScrollBond Genesis")
    );

    // Deploy SIL contract
    const SovereignIdentityLock = await ethers.getContractFactory("SovereignIdentityLock");
    sil = await SovereignIdentityLock.connect(sovereign).deploy(scrollBondHash);
    await sil.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct sovereign identity", async function () {
      expect(await sil.sovereignIdentity()).to.equal(sovereign.address);
    });

    it("Should set the initial ScrollBond hash", async function () {
      expect(await sil.scrollBondNFTHash()).to.equal(scrollBondHash);
    });

    it("Should activate sovereign lock by default", async function () {
      expect(await sil.sovereignLockActive()).to.be.true;
    });

    it("Should enable master governor key by default", async function () {
      expect(await sil.masterGovernorKeyEnabled()).to.be.true;
    });
  });

  describe("Sovereign Lock Management", function () {
    it("Should allow sovereign to deactivate lock", async function () {
      await sil.connect(sovereign).deactivateSovereignLock();
      expect(await sil.sovereignLockActive()).to.be.false;
    });

    it("Should allow sovereign to reactivate lock", async function () {
      await sil.connect(sovereign).deactivateSovereignLock();
      await sil.connect(sovereign).activateSovereignLock();
      expect(await sil.sovereignLockActive()).to.be.true;
    });

    it("Should revert if non-sovereign tries to deactivate", async function () {
      await expect(
        sil.connect(unauthorized).deactivateSovereignLock()
      ).to.be.revertedWith("SIL: Not the Sovereign");
    });

    it("Should emit event on activation", async function () {
      await sil.connect(sovereign).deactivateSovereignLock();
      await expect(sil.connect(sovereign).activateSovereignLock())
        .to.emit(sil, "SovereignLockActivated")
        .withArgs(sovereign.address, await ethers.provider.getBlockNumber() + 1);
    });
  });

  describe("ScrollBond Hash Management", function () {
    it("Should allow sovereign to update ScrollBond hash", async function () {
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("New ScrollBond"));
      await sil.connect(sovereign).updateScrollBondHash(newHash);
      expect(await sil.scrollBondNFTHash()).to.equal(newHash);
    });

    it("Should revert if non-sovereign tries to update hash", async function () {
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("New ScrollBond"));
      await expect(
        sil.connect(unauthorized).updateScrollBondHash(newHash)
      ).to.be.revertedWith("SIL: Not the Sovereign");
    });

    it("Should verify correct ScrollBond hash", async function () {
      expect(await sil.verifyScrollBondHash(scrollBondHash)).to.be.true;
    });

    it("Should reject incorrect ScrollBond hash", async function () {
      const wrongHash = ethers.keccak256(ethers.toUtf8Bytes("Wrong Hash"));
      expect(await sil.verifyScrollBondHash(wrongHash)).to.be.false;
    });

    it("Should emit event on hash update", async function () {
      const newHash = ethers.keccak256(ethers.toUtf8Bytes("New ScrollBond"));
      await expect(sil.connect(sovereign).updateScrollBondHash(newHash))
        .to.emit(sil, "ScrollBondHashUpdated")
        .withArgs(scrollBondHash, newHash);
    });
  });

  describe("Metamask API Key Management", function () {
    it("Should allow sovereign to update API key", async function () {
      const apiKey = "my-secure-api-key";
      const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(apiKey));
      
      await sil.connect(sovereign).updateMetamaskAPIKey(apiKeyHash);
      expect(await sil.authenticateWithAPIKey(apiKey)).to.be.true;
    });

    it("Should reject incorrect API key", async function () {
      const apiKey = "my-secure-api-key";
      const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(apiKey));
      
      await sil.connect(sovereign).updateMetamaskAPIKey(apiKeyHash);
      expect(await sil.authenticateWithAPIKey("wrong-key")).to.be.false;
    });

    it("Should revert if non-sovereign tries to update API key", async function () {
      const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes("key"));
      await expect(
        sil.connect(unauthorized).updateMetamaskAPIKey(apiKeyHash)
      ).to.be.revertedWith("SIL: Not the Sovereign");
    });

    it("Should require lock to be active for authentication", async function () {
      const apiKey = "my-secure-api-key";
      const apiKeyHash = ethers.keccak256(ethers.toUtf8Bytes(apiKey));
      
      await sil.connect(sovereign).updateMetamaskAPIKey(apiKeyHash);
      await sil.connect(sovereign).deactivateSovereignLock();
      
      await expect(
        sil.authenticateWithAPIKey(apiKey)
      ).to.be.revertedWith("SIL: Lock not active");
    });
  });

  describe("Master Governor Key", function () {
    it("Should toggle master governor key", async function () {
      await sil.connect(sovereign).toggleMasterGovernorKey();
      expect(await sil.masterGovernorKeyEnabled()).to.be.false;
      
      await sil.connect(sovereign).toggleMasterGovernorKey();
      expect(await sil.masterGovernorKeyEnabled()).to.be.true;
    });

    it("Should emit event on toggle", async function () {
      await expect(sil.connect(sovereign).toggleMasterGovernorKey())
        .to.emit(sil, "MasterGovernorKeyToggled")
        .withArgs(false, await ethers.provider.getBlockNumber() + 1);
    });

    it("Should revert if non-sovereign tries to toggle", async function () {
      await expect(
        sil.connect(unauthorized).toggleMasterGovernorKey()
      ).to.be.revertedWith("SIL: Not the Sovereign");
    });
  });

  describe("DAO Authorization", function () {
    it("Should allow sovereign to authorize DAO", async function () {
      await sil.connect(sovereign).authorizeDAO(dao1.address);
      expect(await sil.authorizedDAOs(dao1.address)).to.be.true;
    });

    it("Should allow sovereign to revoke DAO", async function () {
      await sil.connect(sovereign).authorizeDAO(dao1.address);
      await sil.connect(sovereign).revokeDAO(dao1.address);
      expect(await sil.authorizedDAOs(dao1.address)).to.be.false;
    });

    it("Should revert if non-sovereign tries to authorize DAO", async function () {
      await expect(
        sil.connect(unauthorized).authorizeDAO(dao1.address)
      ).to.be.revertedWith("SIL: Not the Sovereign");
    });

    it("Should revert if authorizing zero address", async function () {
      await expect(
        sil.connect(sovereign).authorizeDAO(ethers.ZeroAddress)
      ).to.be.revertedWith("SIL: Invalid DAO address");
    });

    it("Should revert if authorizing already authorized DAO", async function () {
      await sil.connect(sovereign).authorizeDAO(dao1.address);
      await expect(
        sil.connect(sovereign).authorizeDAO(dao1.address)
      ).to.be.revertedWith("SIL: DAO already authorized");
    });

    it("Should revert if revoking non-authorized DAO", async function () {
      await expect(
        sil.connect(sovereign).revokeDAO(dao1.address)
      ).to.be.revertedWith("SIL: DAO not authorized");
    });

    it("Should emit events on authorization and revocation", async function () {
      await expect(sil.connect(sovereign).authorizeDAO(dao1.address))
        .to.emit(sil, "DAOAuthorized")
        .withArgs(dao1.address, await ethers.provider.getBlockNumber() + 1);

      await expect(sil.connect(sovereign).revokeDAO(dao1.address))
        .to.emit(sil, "DAORevoked")
        .withArgs(dao1.address, await ethers.provider.getBlockNumber() + 1);
    });
  });

  describe("Operation Verification", function () {
    beforeEach(async function () {
      // Authorize dao1 for testing
      await sil.connect(sovereign).authorizeDAO(dao1.address);
    });

    it("Should verify operation with valid signature from sovereign", async function () {
      const operationData = ethers.toUtf8Bytes("Transfer 1000 tokens");
      const nonce = await sil.operationNonce();
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp;
      
      const messageHash = ethers.keccak256(
        ethers.solidityPacked(
          ['bytes', 'uint256', 'uint256'],
          [operationData, nonce, timestamp]
        )
      );
      
      const signature = await sovereign.signMessage(ethers.getBytes(messageHash));
      
      await expect(sil.connect(dao1).verifyOperation(operationData, signature))
        .to.emit(sil, "OperationVerified");
    });

    it("Should increment nonce after verification", async function () {
      const operationData = ethers.toUtf8Bytes("Transfer 1000 tokens");
      const nonce = await sil.operationNonce();
      const timestamp = (await ethers.provider.getBlock('latest')).timestamp;
      
      const messageHash = ethers.keccak256(
        ethers.solidityPacked(
          ['bytes', 'uint256', 'uint256'],
          [operationData, nonce, timestamp]
        )
      );
      
      const signature = await sovereign.signMessage(ethers.getBytes(messageHash));
      await sil.connect(dao1).verifyOperation(operationData, signature);
      
      expect(await sil.operationNonce()).to.equal(nonce + BigInt(1));
    });

    it("Should revert if lock is not active", async function () {
      await sil.connect(sovereign).deactivateSovereignLock();
      
      const operationData = ethers.toUtf8Bytes("Transfer 1000 tokens");
      const signature = "0x" + "00".repeat(65);
      
      await expect(
        sil.connect(dao1).verifyOperation(operationData, signature)
      ).to.be.revertedWith("SIL: Lock not active");
    });

    it("Should revert if caller is not authorized", async function () {
      const operationData = ethers.toUtf8Bytes("Transfer 1000 tokens");
      const signature = "0x" + "00".repeat(65);
      
      await expect(
        sil.connect(unauthorized).verifyOperation(operationData, signature)
      ).to.be.revertedWith("SIL: DAO not authorized");
    });
  });

  describe("Lock Status", function () {
    it("Should return complete lock status", async function () {
      const status = await sil.getLockStatus();
      
      expect(status[0]).to.be.true; // lockActive
      expect(status[1]).to.be.true; // masterGovernorKey
      expect(status[2]).to.equal(0); // nonce
      expect(status[3]).to.equal(sovereign.address); // sovereign
    });

    it("Should reflect changes in status", async function () {
      await sil.connect(sovereign).deactivateSovereignLock();
      await sil.connect(sovereign).toggleMasterGovernorKey();
      
      const status = await sil.getLockStatus();
      
      expect(status[0]).to.be.false; // lockActive
      expect(status[1]).to.be.false; // masterGovernorKey
    });
  });
});
