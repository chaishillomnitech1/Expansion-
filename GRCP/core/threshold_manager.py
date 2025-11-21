"""
Threshold Manager Module for GRCP
Manages Amnesty/Sanction Thresholds for global resource allocation
Aligned with the Shield of Honor™ Initiative
"""

import json
import os
from typing import Dict, Any, List
from datetime import datetime
from enum import Enum


class AmnestyLevel(Enum):
    """Amnesty levels for resource allocation."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class SanctionLevel(Enum):
    """Sanction levels for ethical enforcement."""
    WARNING = "warning"
    MODERATE = "moderate"
    SEVERE = "severe"
    MAXIMUM = "maximum"


class ThresholdManager:
    """
    Manages amnesty and sanction thresholds for ethical resource allocation.
    Implements the Shield of Honor™ Initiative principles.
    """
    
    def __init__(self, config_path: str = None):
        """Initialize the Threshold Manager with configuration."""
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'settings.json')
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        self.config = config['threshold_management']
        self.current_amnesty = AmnestyLevel(self.config['default_amnesty'])
        self.current_sanction = SanctionLevel(self.config['default_sanction'])
        self.allocation_history = []
        
    def set_amnesty_level(self, level: str) -> Dict[str, Any]:
        """
        Set the global amnesty level for resource distribution.
        
        Args:
            level: Amnesty level (low, medium, high, critical)
            
        Returns:
            Dict containing status and level information
        """
        try:
            new_level = AmnestyLevel(level.lower())
        except ValueError:
            return {
                'success': False,
                'error': f'Invalid amnesty level: {level}',
                'valid_levels': [l.value for l in AmnestyLevel]
            }
        
        previous_level = self.current_amnesty
        self.current_amnesty = new_level
        
        self._log_allocation_change('amnesty', previous_level.value, new_level.value)
        
        return {
            'success': True,
            'previous_level': previous_level.value,
            'current_level': new_level.value,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def set_sanction_level(self, level: str) -> Dict[str, Any]:
        """
        Set the global sanction level for ethical enforcement.
        
        Args:
            level: Sanction level (warning, moderate, severe, maximum)
            
        Returns:
            Dict containing status and level information
        """
        try:
            new_level = SanctionLevel(level.lower())
        except ValueError:
            return {
                'success': False,
                'error': f'Invalid sanction level: {level}',
                'valid_levels': [l.value for l in SanctionLevel]
            }
        
        previous_level = self.current_sanction
        self.current_sanction = new_level
        
        self._log_allocation_change('sanction', previous_level.value, new_level.value)
        
        return {
            'success': True,
            'previous_level': previous_level.value,
            'current_level': new_level.value,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def get_current_thresholds(self) -> Dict[str, str]:
        """
        Get current amnesty and sanction threshold levels.
        
        Returns:
            Dict with current threshold levels
        """
        return {
            'amnesty_level': self.current_amnesty.value,
            'sanction_level': self.current_sanction.value,
            'status': 'active'
        }
    
    def calculate_resource_allocation(self, 
                                      base_allocation: float,
                                      ethical_score: float) -> Dict[str, Any]:
        """
        Calculate resource allocation based on ethical parameters and current thresholds.
        
        Args:
            base_allocation: Base amount of resources to allocate
            ethical_score: Ethical alignment score (0.0 to 1.0)
            
        Returns:
            Dict with allocation details
        """
        # Amnesty multiplier based on current level
        amnesty_multipliers = {
            AmnestyLevel.LOW: 0.5,
            AmnestyLevel.MEDIUM: 1.0,
            AmnestyLevel.HIGH: 1.5,
            AmnestyLevel.CRITICAL: 2.0
        }
        
        # Sanction adjustment based on current level and ethical score
        sanction_penalties = {
            SanctionLevel.WARNING: 0.0,
            SanctionLevel.MODERATE: 0.1,
            SanctionLevel.SEVERE: 0.3,
            SanctionLevel.MAXIMUM: 0.5
        }
        
        amnesty_mult = amnesty_multipliers[self.current_amnesty]
        sanction_penalty = sanction_penalties[self.current_sanction]
        
        # Calculate final allocation
        adjusted_allocation = base_allocation * amnesty_mult
        
        # Apply sanction penalty if ethical score is below threshold
        if ethical_score < 0.5:
            adjusted_allocation *= (1.0 - sanction_penalty)
        
        # Apply ethical score multiplier
        final_allocation = adjusted_allocation * ethical_score
        
        return {
            'base_allocation': base_allocation,
            'amnesty_multiplier': amnesty_mult,
            'sanction_penalty': sanction_penalty,
            'ethical_score': ethical_score,
            'final_allocation': round(final_allocation, 2),
            'amnesty_level': self.current_amnesty.value,
            'sanction_level': self.current_sanction.value,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _log_allocation_change(self, 
                               change_type: str,
                               previous_value: str,
                               new_value: str):
        """Log threshold changes for audit trail."""
        self.allocation_history.append({
            'timestamp': datetime.utcnow().isoformat(),
            'type': change_type,
            'previous': previous_value,
            'new': new_value
        })
    
    def get_allocation_history(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent allocation history.
        
        Args:
            limit: Maximum number of historical entries to return
            
        Returns:
            List of recent allocation changes
        """
        return self.allocation_history[-limit:]
    
    def get_shield_of_honor_metrics(self) -> Dict[str, Any]:
        """
        Get Shield of Honor™ Initiative alignment metrics.
        
        Returns:
            Dict with initiative alignment metrics
        """
        return {
            'initiative': 'Shield of Honor™',
            'amnesty_level': self.current_amnesty.value,
            'sanction_level': self.current_sanction.value,
            'ethical_framework': 'active',
            'resource_distribution': 'optimized',
            'timestamp': datetime.utcnow().isoformat()
        }


if __name__ == '__main__':
    # Example usage
    manager = ThresholdManager()
    print(f"Current thresholds: {manager.get_current_thresholds()}")
    
    # Set high amnesty
    result = manager.set_amnesty_level('high')
    print(f"Set amnesty to high: {result}")
    
    # Calculate resource allocation
    allocation = manager.calculate_resource_allocation(1000, 0.85)
    print(f"Resource allocation: {allocation}")
    
    # Get Shield of Honor metrics
    metrics = manager.get_shield_of_honor_metrics()
    print(f"Shield of Honor metrics: {metrics}")
