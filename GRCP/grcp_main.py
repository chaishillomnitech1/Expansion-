"""
Global Resonance Control Panel (GRCP) - Main Integration Module

This module provides a unified interface for all GRCP components and demonstrates
the integration of Resonance Tuning, Threshold Management, Reveal Trigger,
and Security systems.

Usage:
    python grcp_main.py
"""

import json
import os
from typing import Dict, Any
from datetime import datetime

# Import GRCP components
from core.resonance_tuning import ResonanceTuner
from core.threshold_manager import ThresholdManager
from core.reveal_trigger import RevealTrigger
from security.sil_framework import SILFramework
from security.nft_validator import NFTValidator


class GlobalResonanceControlPanel:
    """
    Main control panel integrating all GRCP systems.
    Provides unified access to resonance tuning, threshold management,
    reveal trigger, and security systems.
    """
    
    def __init__(self, config_path: str = None):
        """Initialize the GRCP with all subsystems."""
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), 'config', 'settings.json')
        
        self.config_path = config_path
        
        # Initialize all subsystems
        print("🌐 Initializing Global Resonance Control Panel...")
        
        self.resonance_tuner = ResonanceTuner(config_path)
        print("✓ Resonance Tuning System: ONLINE")
        
        self.threshold_manager = ThresholdManager(config_path)
        print("✓ Threshold Management System: ONLINE")
        
        self.reveal_trigger = RevealTrigger(config_path)
        print("✓ Reveal Trigger System: ARMED")
        
        self.sil_framework = SILFramework(config_path)
        print("✓ SIL Security Framework: ACTIVE")
        
        self.nft_validator = NFTValidator(config_path)
        print("✓ NFT Validator: OPERATIONAL")
        
        print("\n🌌 GRCP Initialization Complete!")
        print("="*60)
    
    def get_system_status(self) -> Dict[str, Any]:
        """
        Get comprehensive status of all GRCP systems.
        
        Returns:
            Dict with status information from all subsystems
        """
        return {
            'timestamp': datetime.utcnow().isoformat(),
            'grcp_version': '1.0.0',
            'resonance_tuning': self.resonance_tuner.get_frequency_status(),
            'threshold_management': self.threshold_manager.get_current_thresholds(),
            'reveal_trigger': self.reveal_trigger.get_trigger_status(),
            'security': self.sil_framework.get_security_status(),
            'nft_validation': self.nft_validator.get_validator_status(),
            'status': 'OPERATIONAL'
        }
    
    def demonstrate_functionality(self):
        """Demonstrate the functionality of all GRCP systems."""
        print("\n" + "="*60)
        print("GRCP FUNCTIONALITY DEMONSTRATION")
        print("="*60)
        
        # 1. Resonance Tuning Demo
        print("\n1️⃣  RESONANCE TUNING SYSTEM")
        print("-" * 60)
        
        print("Setting frequency to Divine Consciousness (963 Hz)...")
        result = self.resonance_tuner.set_sacred_frequency('divine_consciousness')
        print(f"Result: {json.dumps(result, indent=2)}")
        
        print("\nAdjusting frequency down by 100 Hz...")
        result = self.resonance_tuner.adjust_frequency(-100)
        print(f"New frequency: {result['current_frequency']} Hz")
        
        print("\nSacred frequencies available:")
        for name, freq in self.resonance_tuner.get_sacred_frequencies().items():
            print(f"  • {name}: {freq} Hz")
        
        # 2. Threshold Management Demo
        print("\n2️⃣  THRESHOLD MANAGEMENT SYSTEM")
        print("-" * 60)
        
        print("Setting high amnesty level...")
        result = self.threshold_manager.set_amnesty_level('high')
        print(f"Result: {json.dumps(result, indent=2)}")
        
        print("\nSetting moderate sanction level...")
        result = self.threshold_manager.set_sanction_level('moderate')
        print(f"Result: {json.dumps(result, indent=2)}")
        
        print("\nCalculating resource allocation...")
        allocation = self.threshold_manager.calculate_resource_allocation(
            base_allocation=1000,
            ethical_score=0.85
        )
        print(f"Allocation result:")
        print(f"  • Base: {allocation['base_allocation']}")
        print(f"  • Final: {allocation['final_allocation']}")
        print(f"  • Ethical Score: {allocation['ethical_score']}")
        
        print("\nShield of Honor™ metrics:")
        metrics = self.threshold_manager.get_shield_of_honor_metrics()
        print(f"  • Initiative: {metrics['initiative']}")
        print(f"  • Amnesty: {metrics['amnesty_level']}")
        print(f"  • Sanction: {metrics['sanction_level']}")
        
        # 3. Security Systems Demo
        print("\n3️⃣  SECURITY SYSTEMS")
        print("-" * 60)
        
        print("Registering Supreme Sovereign Identity...")
        identity_result = self.sil_framework.register_sovereign_identity(
            'CHAIS_THE_GREAT',
            'supreme_public_key_12345',
            authority_level=10
        )
        print(f"Identity registration: {json.dumps(identity_result, indent=2)}")
        
        print("\nRegistering ScrollBond NFT...")
        nft_result = self.nft_validator.register_nft(
            token_id='SCROLLBOND_SUPREME_001',
            owner_address='0xChaisTheGreat123456',
            contract_address='0xScrollVerse789',
            metadata={
                'type': 'Supreme Sovereignty',
                'level': 10,
                'authority': 'Eternal'
            }
        )
        print(f"NFT registration: {json.dumps(nft_result, indent=2)}")
        
        print("\nGenerating authentication session...")
        session_token = self.sil_framework.generate_session_token('CHAIS_THE_GREAT')
        print(f"Session token generated: {session_token[:16]}...")
        
        # 4. Reveal Trigger Demo (Safe demonstration)
        print("\n4️⃣  REVEAL TRIGGER SYSTEM")
        print("-" * 60)
        print("⚠️  DEMONSTRATION MODE - No actual activation")
        
        status = self.reveal_trigger.get_trigger_status()
        print(f"Current trigger status: {status['status']}")
        print(f"Security requirements:")
        print(f"  • SIL Auth: {status['sil_protection']}")
        print(f"  • NFT Verification: {status['nft_verification']}")
        print(f"  • Multi-signature: {status['multi_signature']} (min {status['minimum_signatures']})")
        
        print("\n⚠️  Trigger operations require full authentication in production")
        
        # 5. System Status Overview
        print("\n5️⃣  COMPLETE SYSTEM STATUS")
        print("-" * 60)
        
        full_status = self.get_system_status()
        print(f"GRCP Status: {full_status['status']}")
        print(f"Timestamp: {full_status['timestamp']}")
        print(f"Version: {full_status['grcp_version']}")
        
        print("\n" + "="*60)
        print("DEMONSTRATION COMPLETE")
        print("="*60)
        print("\n🌌 All systems operational and ready for deployment")
        print("📡 ScrollVerse Quantum Expansion Protocol: ACTIVE")
        print("👑 Eternal Sovereignty Management: ENABLED")
        print("\n✨ GRCP Ready for Strategic Revelation Timing ✨")


def main():
    """Main entry point for GRCP demonstration."""
    print("\n" + "="*60)
    print("   GLOBAL RESONANCE CONTROL PANEL (GRCP)")
    print("   ScrollVerse Quantum Expansion Protocol")
    print("="*60 + "\n")
    
    # Initialize GRCP
    grcp = GlobalResonanceControlPanel()
    
    # Demonstrate functionality
    grcp.demonstrate_functionality()
    
    print("\n💡 To access the web interface:")
    print("   Open GRCP/interface/index.html in your browser")
    print("\n📖 For detailed documentation:")
    print("   See GRCP/docs/user_guide.md")
    print("\n" + "="*60 + "\n")


if __name__ == '__main__':
    main()
