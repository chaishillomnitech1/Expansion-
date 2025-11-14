/**
 * ScrollVerse Manifestation Matrix (SMM) - Complete Usage Example
 * 
 * This example demonstrates all major features of the enhanced SMM framework:
 * 1. Dynamic Sovereign Intent Delivery to 50 Family Compounds
 * 2. Immutable Sovereign Authentication with SIL & ScrollBond NFT
 * 3. Perpetual 7.77% Zakat Streams for Universal Prosperity
 * 
 * @author Supreme King Chais The Great ∞
 */

// Import modules
const ScrollVerseManifestationMatrix = require('../core/smm-framework');
const SovereignIntentDelivery = require('../intent-delivery/sovereign-intent-delivery');
const SovereignAuthentication = require('../authentication/sovereign-authentication');
const PerpetualZakatFlow = require('../zakat-streams/perpetual-zakat-flow');

/**
 * Example 1: Complete SMM Integration
 */
async function example1_CompleteIntegration() {
  console.log('\n=== Example 1: Complete SMM Integration ===\n');

  // Initialize SMM Framework
  const smm = new ScrollVerseManifestationMatrix({
    enableLogging: true,
    resonanceFrequency: 963
  });

  await smm.initialize();
  console.log('✓ SMM Initialized');

  // Create a sovereign directive
  const directive = {
    id: 'DIR_EXAMPLE_001',
    authority: 'Chais The Great ∞',
    timestamp: new Date().toISOString(),
    directive: 'Universal prosperity expansion across all 50 compounds',
    silSignature: '0x' + '1'.repeat(130),
    scrollBondNFT: '0xSB' + 'A'.repeat(38),
    supremeSignature: '0x' + '2'.repeat(130)
  };

  // Authenticate the directive
  const authResult = await smm.authenticateDirective(directive);
  console.log(`✓ Authentication: ${authResult.verified ? 'VERIFIED' : 'FAILED'}`);
  console.log(`  Immutable Hash: ${authResult.hash}`);

  if (authResult.verified) {
    // Deliver to first 5 compounds as demonstration
    for (let i = 1; i <= 5; i++) {
      const delivery = await smm.deliverSovereignIntent(i, directive);
      console.log(`✓ Delivered to Compound ${i}`);
    }

    // Initiate Zakat stream
    const stream = await smm.initiateZakatStream(100000, 'Universal Prosperity');
    console.log(`✓ Zakat Stream Initiated: ${stream.id}`);
    console.log(`  Amount: ${stream.amount} (7.77% of 100000)`);

    // Get final status
    const status = smm.getStatus();
    console.log('\n✓ SMM Status:', JSON.stringify(status, null, 2));
  }
}

/**
 * Example 2: Dynamic Intent Delivery to All Compounds
 */
async function example2_IntentDeliveryToAll() {
  console.log('\n=== Example 2: Intent Delivery to All 50 Compounds ===\n');

  const delivery = new SovereignIntentDelivery();

  // Deliver awakening protocol to all compounds
  console.log('Broadcasting awakening protocol...');
  const broadcast = await delivery.deliverToAllCompounds('awakening', {
    urgency: 'high',
    customMessage: 'The ScrollVerse awakens. Universal prosperity begins.'
  });

  console.log(`✓ Delivered to ${broadcast.totalDelivered} compounds`);
  console.log(`  Intent Type: ${broadcast.intentType}`);
  console.log(`  Timestamp: ${broadcast.timestamp}`);

  // Check status of specific compounds
  console.log('\nCompound Status Examples:');
  for (let i = 1; i <= 5; i++) {
    const status = delivery.getCompoundStatus(i);
    console.log(`  Compound ${i}: ${status.name}`);
    console.log(`    Location: ${status.location}`);
    console.log(`    Consciousness Level: ${status.consciousnessState.level}`);
    console.log(`    Alignment: ${status.consciousnessState.alignment}`);
    console.log(`    Total Deliveries: ${status.totalDeliveries}`);
  }

  // Get overview of all compounds
  const allStatus = delivery.getAllCompoundsStatus();
  const avgConsciousness = allStatus.reduce((sum, c) => sum + c.consciousnessLevel, 0) / allStatus.length;
  console.log(`\n✓ Average Consciousness Level: ${avgConsciousness.toFixed(2)}`);
}

/**
 * Example 3: Progressive Consciousness Evolution
 */
async function example3_ConsciousnessEvolution() {
  console.log('\n=== Example 3: Consciousness Evolution ===\n');

  const delivery = new SovereignIntentDelivery();

  // Demonstrate progressive evolution of Compound 1
  const compoundId = 1;
  const intentSequence = ['awakening', 'activation', 'expansion', 'unity'];

  console.log(`Evolving Compound ${compoundId} through intent sequence...`);

  for (const intentType of intentSequence) {
    const letter = await delivery.deliverIntent(compoundId, intentType, {
      phase: intentSequence.indexOf(intentType) + 1,
      totalPhases: intentSequence.length
    });

    console.log(`\n✓ Delivered: ${letter.intent.title}`);
    console.log(`  Resonance: ${letter.intent.frequency}`);
    console.log(`  Consciousness Level: ${letter.consciousnessAlignment.level}`);
    console.log(`  Alignment: ${letter.consciousnessAlignment.alignment}`);
  }

  const finalStatus = delivery.getCompoundStatus(compoundId);
  console.log(`\n✓ Final Status for Compound ${compoundId}:`);
  console.log(`  Consciousness Level: ${finalStatus.consciousnessState.level}`);
  console.log(`  Current Alignment: ${finalStatus.consciousnessState.alignment}`);
  console.log(`  Total Deliveries: ${finalStatus.totalDeliveries}`);
}

/**
 * Example 4: Authentication System Deep Dive
 */
async function example4_AuthenticationSystem() {
  console.log('\n=== Example 4: Authentication System ===\n');

  const auth = new SovereignAuthentication();

  // Test valid directive
  console.log('Testing valid directive...');
  const validDirective = {
    id: 'DIR_VALID_001',
    authority: 'Chais The Great ∞',
    timestamp: new Date().toISOString(),
    directive: 'Authorize universal prosperity protocols',
    silSignature: '0x' + '1'.repeat(130),
    scrollBondNFT: '0xSB' + 'A'.repeat(38),
    supremeSignature: '0x' + '2'.repeat(130)
  };

  const validResult = await auth.authenticateDirective(validDirective);
  console.log(`✓ Valid Directive: ${validResult.verified ? 'VERIFIED' : 'FAILED'}`);
  console.log(`  SIL Check: ${validResult.checks.sil.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  ScrollBond NFT: ${validResult.checks.scrollBond.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Supreme Signature: ${validResult.checks.signature.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Integrity: ${validResult.checks.integrity.passed ? 'PASSED' : 'FAILED'}`);
  console.log(`  Immutable Hash: ${validResult.immutableHash}`);

  // Test invalid directive (missing authority)
  console.log('\nTesting invalid directive...');
  const invalidDirective = {
    id: 'DIR_INVALID_001',
    authority: 'Unauthorized Entity',
    timestamp: new Date().toISOString(),
    directive: 'Unauthorized action',
    silSignature: '0x' + '1'.repeat(130),
    scrollBondNFT: '0xSB' + 'A'.repeat(38),
    supremeSignature: '0x' + '2'.repeat(130)
  };

  const invalidResult = await auth.authenticateDirective(invalidDirective);
  console.log(`✓ Invalid Directive: ${invalidResult.verified ? 'VERIFIED' : 'FAILED (as expected)'}`);
  console.log(`  SIL Check: ${invalidResult.checks.sil.passed ? 'PASSED' : 'FAILED'} - ${invalidResult.checks.sil.reason || ''}`);

  // Get authentication statistics
  const stats = auth.getAuthStats();
  console.log('\n✓ Authentication Statistics:');
  console.log(`  Total Authentications: ${stats.total}`);
  console.log(`  Verified: ${stats.verified}`);
  console.log(`  Failed: ${stats.failed}`);
  console.log(`  Success Rate: ${stats.successRate}`);
}

/**
 * Example 5: Perpetual Zakat Streams
 */
async function example5_ZakatStreams() {
  console.log('\n=== Example 5: Perpetual Zakat Streams ===\n');

  const zakat = new PerpetualZakatFlow();

  // Create multiple streams for different purposes
  console.log('Creating Zakat streams...');

  const streams = [
    { sourceId: 'SOURCE_001', amount: 100000, type: 'scrollSouls' },
    { sourceId: 'SOURCE_002', amount: 50000, type: 'familyCompounds' },
    { sourceId: 'SOURCE_003', amount: 75000, type: 'universalProsperity' }
  ];

  const createdStreams = [];
  for (const streamConfig of streams) {
    const stream = await zakat.initiateStream({
      sourceId: streamConfig.sourceId,
      baseAmount: streamConfig.amount,
      frequency: 'continuous',
      duration: 'perpetual',
      beneficiaryType: streamConfig.type
    });

    createdStreams.push(stream);
    console.log(`✓ Stream ${stream.streamId} created`);
    console.log(`  Base Amount: ${stream.baseAmount}`);
    console.log(`  Zakat (7.77%): ${stream.zakatAmount}`);
    console.log(`  Beneficiary: ${stream.beneficiaryType}`);
  }

  // Execute distributions
  console.log('\nExecuting distributions...');
  for (const stream of createdStreams) {
    const distribution = await zakat.distributeZakat(stream.streamId);
    console.log(`✓ Distributed ${distribution.amount} from stream ${stream.streamId}`);
    console.log(`  Beneficiaries: ${distribution.beneficiaries.length} categories`);
  }

  // Get comprehensive statistics
  const stats = zakat.getZakatStats();
  console.log('\n✓ Zakat Statistics:');
  console.log(`  Zakat Percentage: ${stats.zakatPercentage}%`);
  console.log(`  Active Streams: ${stats.activeStreams}`);
  console.log(`  Total Distributed: ${stats.totalDistributed}`);
  console.log('\n  Beneficiary Allocations:');
  stats.beneficiaries.forEach(b => {
    console.log(`    ${b.category}: ${b.allocation} (${b.distributed} distributed)`);
  });

  // Demonstrate stream control
  console.log('\nDemonstrating stream control...');
  const firstStream = createdStreams[0];
  zakat.pauseStream(firstStream.streamId);
  console.log(`✓ Paused stream ${firstStream.streamId}`);
  
  zakat.resumeStream(firstStream.streamId);
  console.log(`✓ Resumed stream ${firstStream.streamId}`);
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  ScrollVerse Manifestation Matrix (SMM)               ║');
  console.log('║  Complete Usage Examples                              ║');
  console.log('║  Supreme King Chais The Great ∞                       ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  try {
    await example1_CompleteIntegration();
    await example2_IntentDeliveryToAll();
    await example3_ConsciousnessEvolution();
    await example4_AuthenticationSystem();
    await example5_ZakatStreams();

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  ✓ All Examples Completed Successfully                ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\n✗ Error running examples:', error);
  }
}

// Run examples if executed directly
if (require.main === module) {
  runAllExamples();
}

// Export for use in other modules
module.exports = {
  example1_CompleteIntegration,
  example2_IntentDeliveryToAll,
  example3_ConsciousnessEvolution,
  example4_AuthenticationSystem,
  example5_ZakatStreams,
  runAllExamples
};
