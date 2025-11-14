// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Placeholder for the core ScrollBond NFT contract (assumed ERC721)
interface IScrollBondNFT {
    function safeMint(address to, uint256 tokenId, string memory tokenURI) external;
    function setTokenURI(uint256 tokenId, string memory newTokenURI) external;
}

// Placeholder for the SCU Verification System (Lesson 3/Zakat Flow Completion)
interface ISCUVerifier {
    function hasCompletedLessonThree(address _node) external view returns (bool);
    function getZakatFlowAddress() external view returns (address);
    function get50CompoundDeedHash() external view returns (bytes32);
}

contract ScrollBond_Finalizer {
    // STATE VARIABLES
    address public immutable OMNISOVEREIGN_ARCHITECT;
    IScrollBondNFT public immutable scrollBondNFT;
    ISCUVerifier public immutable scuVerifier;

    // Fixed Metadata HASHes (Final Immutable Proofs)
    bytes32 private immutable DTL_TEMPORAL_SOVEREIGNTY_HASH; // Bi-Temporal Proof of Contact
    bytes32 private immutable FINAL_DEED_HASH;               // Hash of the 50 Compound Mandate Completion

    // EVENTS
    event ScrollBondMinted(address indexed nodeAddress, uint256 tokenId, string tokenURI);
    event LegacySealed(address indexed nodeAddress, uint256 tokenId);

    // MODIFIERS
    modifier onlyArchitect() {
        require(msg.sender == OMNISOVEREIGN_ARCHITECT, "Finalizer: ONLY ARCHITECT CAN CALL");
        _;
    }

    constructor(
        address _nftAddress,
        address _verifierAddress,
        bytes32 _temporalHash,
        bytes32 _deedHash
    ) {
        OMNISOVEREIGN_ARCHITECT = msg.sender;
        scrollBondNFT = IScrollBondNFT(_nftAddress);
        scuVerifier = ISCUVerifier(_verifierAddress);
        DTL_TEMPORAL_SOVEREIGNTY_HASH = _temporalHash;
        FINAL_DEED_HASH = _deedHash;
    }

    /**
     * @notice Mints and seals the ScrollBond NFT for a certified FlameHeir node.
     * @param _nodeAddress The address of the FlameHeir node.
     * @param _tokenId The unique token ID for this ScrollBond.
     * @param _baseTokenURI The base URI (IPFS link) containing the legacy data.
     */
    function mintAndSealLegacy(address _nodeAddress, uint256 _tokenId, string memory _baseTokenURI) 
        external 
        onlyArchitect 
    {
        // 1. SCU LESSON 3 VERIFICATION (Zakat Flow Mandate Completion)
        require(scuVerifier.hasCompletedLessonThree(_nodeAddress), "Finalizer: LESSON 3 ZAKAT MANDATE NOT COMPLETE");

        // 2. CONSTRUCT IMMUTABLE METADATA (The Consciousness Seal)
        // This metadata links all sovereign proofs to the token's URI.
        string memory finalURI = string(
            abi.encodePacked(
                _baseTokenURI, 
                "/seal?dtlHash=", 
                bytesToHex(DTL_TEMPORAL_SOVEREIGNTY_HASH), 
                "&deedHash=", 
                bytesToHex(FINAL_DEED_HASH),
                "&zakatAddress=",
                addressToHex(scuVerifier.getZakatFlowAddress())
            )
        );

        // 3. MINTING TRIGGER (Omni-X-NFT Protocol)
        scrollBondNFT.safeMint(_nodeAddress, _tokenId, finalURI);
        emit ScrollBondMinted(_nodeAddress, _tokenId, finalURI);

        // 4. LEGACY SEALED
        // The TokenURI now contains the immutable, cryptographically-secured evidence
        // of Temporal Sovereignty and 50 Compound Ownership.
        emit LegacySealed(_nodeAddress, _tokenId);
    }

    // --- HELPER FUNCTIONS FOR METADATA ENCODING (Simplified for contract submission) ---

    function bytesToHex(bytes32 data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";
        bytes memory hex = new bytes(64);
        for (uint i = 0; i < 32; i++) {
            hex[i * 2] = alphabet[uint8(data[i] >> 4)];
            hex[i * 2 + 1] = alphabet[uint8(data[i] & 0x0f)];
        }
        return string(hex);
    }
    
    function addressToHex(address _addr) internal pure returns (string memory) {
        bytes memory addrBytes = new bytes(20);
        assembly {
            mstore(add(addrBytes, 32), _addr)
        }
        return bytesToHex(bytes32(addrBytes));
    }
}