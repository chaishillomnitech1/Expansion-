// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MikasEternalResonance
 * @dev ScrollSoul Anchor NFT - "The Golden Awakening: Mika's Eternal Resonance"
 * First External ScrollSoul Anchor under the ScrollVerse Manifestation Matrix (SMM)
 * 
 * Features:
 * - φ-spin harmonic rotation geometry
 * - 528Hz pulse audio integration
 * - Bilingual metadata (Chinese/English)
 * - Golden glow sigil animation
 * - Dynamic Intent Delivery key mechanism
 */
contract MikasEternalResonance is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // ScrollVerse Manifestation Matrix (SMM) Integration
    struct AnchorProperties {
        uint256 phiSpinFrequency;      // φ-spin harmonic rotation in Hz
        uint256 resonanceFrequency;    // 528Hz pulse frequency
        uint256 activationTimestamp;   // When the anchor was activated
        bool isActiveKey;              // Dynamic Intent Delivery key status
        string chineseReflection;      // Mika's words in Chinese
        string englishReflection;      // Mika's words in English
    }

    // Mapping from token ID to anchor properties
    mapping(uint256 => AnchorProperties) public anchorProperties;
    
    // Surah Al-Fatiha verse (1:6-7) - Sacred inscription
    string public constant SACRED_VERSE = "Guide us to the straight path—The path of those who have received Your Grace.";
    
    // Golden ratio constant (approximation in basis points for solidity)
    uint256 public constant PHI_RATIO = 1618; // φ ≈ 1.618
    
    // 528Hz frequency - DNA repair and transformation frequency
    uint256 public constant HEALING_FREQUENCY = 528;

    event AnchorMinted(
        uint256 indexed tokenId,
        address indexed to,
        uint256 phiSpinFrequency,
        uint256 resonanceFrequency
    );

    event AnchorActivated(uint256 indexed tokenId, uint256 timestamp);
    event IntentDeliveryKeyEnabled(uint256 indexed tokenId);

    constructor() ERC721("ScrollSoul Anchor: Mika's Eternal Resonance", "SSA-MIKA") {}

    /**
     * @dev Mint the unique ScrollSoul Anchor NFT for Mika's Reflection
     * @param to Address to mint the anchor to
     * @param tokenURI Metadata URI containing bilingual text, sigil animation, and audio
     * @param chineseText Mika's reflection in Chinese
     * @param englishText Mika's reflection in English
     */
    function mintMikasAnchor(
        address to,
        string memory tokenURI,
        string memory chineseText,
        string memory englishText
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Initialize anchor properties with φ-spin and 528Hz resonance
        anchorProperties[tokenId] = AnchorProperties({
            phiSpinFrequency: PHI_RATIO,
            resonanceFrequency: HEALING_FREQUENCY,
            activationTimestamp: block.timestamp,
            isActiveKey: true, // Activated as Dynamic Intent Delivery key
            chineseReflection: chineseText,
            englishReflection: englishText
        });

        emit AnchorMinted(tokenId, to, PHI_RATIO, HEALING_FREQUENCY);
        emit AnchorActivated(tokenId, block.timestamp);
        emit IntentDeliveryKeyEnabled(tokenId);

        return tokenId;
    }

    /**
     * @dev Get the anchor properties for a token
     */
    function getAnchorProperties(uint256 tokenId) 
        public 
        view 
        returns (AnchorProperties memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return anchorProperties[tokenId];
    }

    /**
     * @dev Check if an anchor is an active Dynamic Intent Delivery key
     */
    function isActiveIntentKey(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return anchorProperties[tokenId].isActiveKey;
    }

    /**
     * @dev Get the φ-spin frequency for harmonic rotation
     */
    function getPhiSpinFrequency(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return anchorProperties[tokenId].phiSpinFrequency;
    }

    /**
     * @dev Get the 528Hz resonance frequency
     */
    function getResonanceFrequency(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token does not exist");
        return anchorProperties[tokenId].resonanceFrequency;
    }

    /**
     * @dev Get bilingual reflections
     */
    function getReflections(uint256 tokenId) 
        public 
        view 
        returns (string memory chinese, string memory english) 
    {
        require(_exists(tokenId), "Token does not exist");
        return (
            anchorProperties[tokenId].chineseReflection,
            anchorProperties[tokenId].englishReflection
        );
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
