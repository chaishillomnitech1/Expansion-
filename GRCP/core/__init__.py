"""
GRCP Core Module
Provides initialization and integration for all GRCP components
"""

from .resonance_tuning import ResonanceTuner
from .threshold_manager import ThresholdManager
from .reveal_trigger import RevealTrigger

__all__ = ['ResonanceTuner', 'ThresholdManager', 'RevealTrigger']
__version__ = '1.0.0'
