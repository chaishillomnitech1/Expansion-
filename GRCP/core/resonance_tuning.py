"""
Resonance Tuning Module for GRCP
Manages dynamic frequency control for the Cosmic Broadcast Ascension Protocol (CBAP)
"""

import json
import os
from typing import Optional, Dict, Any
from datetime import datetime


class ResonanceTuner:
    """
    Controls and manages resonance frequencies for global broadcast systems.
    Operates within the range of 963 Hz (Divine Consciousness) to 369 Hz (Tesla Frequency).
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """Initialize the Resonance Tuner with configuration."""
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'settings.json')
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        self.config = config['resonance_tuning']
        self.max_freq = self.config['max_frequency']
        self.min_freq = self.config['min_frequency']
        self.current_frequency = self.config['default_frequency']
        self.frequency_history = []
        
    def set_frequency(self, frequency: int) -> Dict[str, Any]:
        """
        Set the global resonance frequency.
        
        Args:
            frequency: Target frequency in Hz (369-963 Hz range)
            
        Returns:
            Dict containing status and frequency information
        """
        if not self.min_freq <= frequency <= self.max_freq:
            return {
                'success': False,
                'error': f'Frequency must be between {self.min_freq} and {self.max_freq} Hz',
                'current_frequency': self.current_frequency
            }
        
        previous_frequency = self.current_frequency
        self.current_frequency = frequency
        
        # Log frequency change
        self.frequency_history.append({
            'timestamp': datetime.utcnow().isoformat(),
            'previous': previous_frequency,
            'new': frequency
        })
        
        return {
            'success': True,
            'previous_frequency': previous_frequency,
            'current_frequency': self.current_frequency,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def adjust_frequency(self, delta: int) -> Dict[str, Any]:
        """
        Adjust current frequency by a delta amount.
        
        Args:
            delta: Amount to adjust frequency (positive or negative)
            
        Returns:
            Dict containing status and frequency information
        """
        new_frequency = self.current_frequency + delta
        return self.set_frequency(new_frequency)
    
    def get_current_frequency(self) -> int:
        """Get the current resonance frequency."""
        return self.current_frequency
    
    def get_frequency_status(self) -> Dict[str, Any]:
        """
        Get comprehensive status of the resonance system.
        
        Returns:
            Dict with current status and configuration
        """
        return {
            'current_frequency': self.current_frequency,
            'min_frequency': self.min_freq,
            'max_frequency': self.max_freq,
            'frequency_unit': self.config['frequency_unit'],
            'status': 'operational',
            'last_update': self.frequency_history[-1] if self.frequency_history else None
        }
    
    def get_sacred_frequencies(self) -> Dict[str, int]:
        """
        Return predefined sacred frequencies for quick access.
        
        Returns:
            Dict of named sacred frequencies
        """
        return {
            'divine_consciousness': 963,  # Pineal gland activation
            'pure_miracle_tone': 852,     # Awakening intuition
            'sol_frequency': 741,         # Problem solving
            'heart_chakra': 639,          # Connection and relationships
            'dna_repair': 528,            # Love frequency, DNA repair
            'transformation': 417,        # Facilitating change
            'tesla_frequency': 369        # Universal connectivity
        }
    
    def set_sacred_frequency(self, frequency_name: str) -> Dict[str, Any]:
        """
        Set frequency to a predefined sacred frequency.
        
        Args:
            frequency_name: Name of the sacred frequency
            
        Returns:
            Dict containing status and frequency information
        """
        sacred_freqs = self.get_sacred_frequencies()
        
        if frequency_name not in sacred_freqs:
            return {
                'success': False,
                'error': f'Unknown sacred frequency: {frequency_name}',
                'available_frequencies': list(sacred_freqs.keys())
            }
        
        frequency = sacred_freqs[frequency_name]
        result = self.set_frequency(frequency)
        result['frequency_name'] = frequency_name
        return result
    
    def get_frequency_history(self, limit: int = 10) -> list:
        """
        Get recent frequency change history.
        
        Args:
            limit: Maximum number of historical entries to return
            
        Returns:
            List of recent frequency changes
        """
        return self.frequency_history[-limit:]


if __name__ == '__main__':
    # Example usage
    tuner = ResonanceTuner()
    print(f"Current frequency: {tuner.get_current_frequency()} Hz")
    
    # Set to divine consciousness frequency
    result = tuner.set_sacred_frequency('divine_consciousness')
    print(f"Set to Divine Consciousness: {result}")
    
    # Get status
    status = tuner.get_frequency_status()
    print(f"System status: {status}")
