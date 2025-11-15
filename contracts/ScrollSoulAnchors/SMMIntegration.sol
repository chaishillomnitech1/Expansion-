// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SMMIntegration
 * @dev ScrollVerse Manifestation Matrix Integration
 * Enables Dynamic Intent Delivery mechanism for ScrollSoul Anchors
 * 
 * The SMM serves as the core framework connecting all ScrollSoul Anchors
 * and enabling them to function as keys for awakening reflections within
 * the ScrollVerse ecosystem.
 */
contract SMMIntegration {
    // Manifestation Matrix state
    struct IntentDelivery {
        uint256 anchorId;
        address anchorContract;
        uint256 activationTimestamp;
        uint256 resonanceStrength;     // 0-1000 (basis points)
        bool isActive;
        string intentType;             // "awakening", "guidance", "resonance"
    }

    // Reflection state for awakened souls
    struct Reflection {
        uint256 sourceAnchorId;
        address reflectionOwner;
        uint256 awakeningTimestamp;
        uint256 resonanceLevel;
        bool isAwakened;
    }

    // Registry of all registered anchors
    mapping(address => mapping(uint256 => IntentDelivery)) public registeredAnchors;
    
    // Registry of awakened reflections
    mapping(address => Reflection[]) public reflections;
    
    // Global awakening counter
    uint256 public totalAwakenings;
    
    // φ-spin harmonic constants
    uint256 public constant PHI_RATIO = 1618; // φ ≈ 1.618
    uint256 public constant FULL_RESONANCE = 1000; // 100.0%

    event AnchorRegistered(
        address indexed anchorContract,
        uint256 indexed anchorId,
        string intentType
    );

    event ReflectionAwakened(
        address indexed reflectionOwner,
        uint256 indexed sourceAnchorId,
        uint256 resonanceLevel
    );

    event IntentDelivered(
        address indexed anchorContract,
        uint256 indexed anchorId,
        address indexed recipient,
        string intentType
    );

    /**
     * @dev Register a ScrollSoul Anchor with the SMM
     * @param anchorContract Address of the anchor NFT contract
     * @param anchorId Token ID of the anchor
     * @param intentType Type of intent: "awakening", "guidance", "resonance"
     */
    function registerAnchor(
        address anchorContract,
        uint256 anchorId,
        string memory intentType
    ) external {
        require(anchorContract != address(0), "Invalid anchor contract");
        
        registeredAnchors[anchorContract][anchorId] = IntentDelivery({
            anchorId: anchorId,
            anchorContract: anchorContract,
            activationTimestamp: block.timestamp,
            resonanceStrength: FULL_RESONANCE, // Start at full resonance
            isActive: true,
            intentType: intentType
        });

        emit AnchorRegistered(anchorContract, anchorId, intentType);
    }

    /**
     * @dev Awaken a reflection through a ScrollSoul Anchor
     * @param anchorContract Address of the source anchor contract
     * @param anchorId Token ID of the source anchor
     * @param reflectionOwner Address receiving the awakened reflection
     */
    function awakenReflection(
        address anchorContract,
        uint256 anchorId,
        address reflectionOwner
    ) external returns (uint256) {
        require(reflectionOwner != address(0), "Invalid reflection owner");
        
        IntentDelivery storage anchor = registeredAnchors[anchorContract][anchorId];
        require(anchor.isActive, "Anchor not active");

        // Calculate resonance level based on φ-spin harmonics
        uint256 resonanceLevel = calculateResonanceLevel(
            anchor.resonanceStrength,
            block.timestamp - anchor.activationTimestamp
        );

        Reflection memory newReflection = Reflection({
            sourceAnchorId: anchorId,
            reflectionOwner: reflectionOwner,
            awakeningTimestamp: block.timestamp,
            resonanceLevel: resonanceLevel,
            isAwakened: true
        });

        reflections[reflectionOwner].push(newReflection);
        totalAwakenings++;

        emit ReflectionAwakened(reflectionOwner, anchorId, resonanceLevel);
        emit IntentDelivered(anchorContract, anchorId, reflectionOwner, anchor.intentType);

        return reflections[reflectionOwner].length - 1;
    }

    /**
     * @dev Calculate resonance level using φ-spin harmonics
     * @param baseStrength Base resonance strength
     * @param timeSinceActivation Time elapsed since anchor activation
     * @return Calculated resonance level
     */
    function calculateResonanceLevel(
        uint256 baseStrength,
        uint256 timeSinceActivation
    ) internal pure returns (uint256) {
        // Apply φ-spin harmonic decay/growth curve
        // Resonance grows over time following golden ratio progression
        uint256 timeFactorBps = (timeSinceActivation * PHI_RATIO) / 1e6;
        uint256 resonance = baseStrength + timeFactorBps;
        
        // Cap at full resonance
        if (resonance > FULL_RESONANCE) {
            return FULL_RESONANCE;
        }
        
        return resonance;
    }

    /**
     * @dev Get all reflections for an address
     */
    function getReflections(address owner) 
        external 
        view 
        returns (Reflection[] memory) 
    {
        return reflections[owner];
    }

    /**
     * @dev Get reflection count for an address
     */
    function getReflectionCount(address owner) external view returns (uint256) {
        return reflections[owner].length;
    }

    /**
     * @dev Check if an anchor is registered and active
     */
    function isAnchorActive(address anchorContract, uint256 anchorId) 
        external 
        view 
        returns (bool) 
    {
        return registeredAnchors[anchorContract][anchorId].isActive;
    }

    /**
     * @dev Get intent delivery details for an anchor
     */
    function getIntentDelivery(address anchorContract, uint256 anchorId)
        external
        view
        returns (IntentDelivery memory)
    {
        return registeredAnchors[anchorContract][anchorId];
    }

    /**
     * @dev Calculate current resonance for an anchor (view function)
     */
    function getCurrentResonance(address anchorContract, uint256 anchorId)
        external
        view
        returns (uint256)
    {
        IntentDelivery storage anchor = registeredAnchors[anchorContract][anchorId];
        if (!anchor.isActive) return 0;
        
        return calculateResonanceLevel(
            anchor.resonanceStrength,
            block.timestamp - anchor.activationTimestamp
        );
    }
}
