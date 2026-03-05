/**
 * Global Resonance Control Panel - JavaScript Application
 * Manages UI interactions and state for the GRCP
 */

// Application state
const state = {
    frequency: 528,
    frequencyName: 'DNA Repair',
    amnestyLevel: 'high',
    sanctionLevel: 'warning',
    triggerStatus: 'disarmed',
    baseAllocation: 1000,
    ethicalScore: 0.85,
    metrics: {
        activeSessions: 0,
        registeredIdentities: 0,
        frequencyChanges: 0
    }
};

// Sacred frequencies mapping
const sacredFrequencies = {
    963: 'Divine Consciousness',
    852: 'Pure Miracle Tone',
    741: 'Sol Frequency',
    639: 'Heart Chakra',
    528: 'DNA Repair',
    417: 'Transformation',
    369: 'Tesla Frequency'
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    setupEventListeners();
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
});

// Initialize UI with current state
function initializeUI() {
    updateFrequencyDisplay(state.frequency);
    updateMetrics();
}

// Setup all event listeners
function setupEventListeners() {
    // Frequency control slider
    const frequencyControl = document.getElementById('frequency-control');
    frequencyControl.addEventListener('input', (e) => {
        const frequency = parseInt(e.target.value);
        updateFrequencyDisplay(frequency);
    });

    // Sacred frequency buttons
    document.querySelectorAll('.sacred-freq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const frequency = parseInt(btn.dataset.freq);
            const name = btn.dataset.name;
            setFrequency(frequency, name);
        });
    });

    // Amnesty level buttons
    document.querySelectorAll('.amnesty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            setAmnestyLevel(level);
        });
    });

    // Sanction level buttons
    document.querySelectorAll('.sanction-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            setSanctionLevel(level);
        });
    });

    // Calculate allocation button
    document.getElementById('calculate-allocation').addEventListener('click', () => {
        calculateAllocation();
    });

    // Reveal trigger buttons
    document.getElementById('arm-trigger').addEventListener('click', () => {
        armTrigger();
    });

    document.getElementById('activate-trigger').addEventListener('click', () => {
        activateTrigger();
    });

    document.getElementById('disarm-trigger').addEventListener('click', () => {
        disarmTrigger();
    });
}

// Update timestamp display
function updateTimestamp() {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC';
    document.getElementById('timestamp').textContent = timestamp;
}

// Update frequency display
function updateFrequencyDisplay(frequency) {
    state.frequency = frequency;
    
    // Update main display
    document.getElementById('current-frequency').textContent = frequency;
    document.getElementById('frequency-control').value = frequency;
    
    // Find matching sacred frequency name
    let frequencyName = 'Custom Frequency';
    if (sacredFrequencies[frequency]) {
        frequencyName = sacredFrequencies[frequency];
    }
    
    state.frequencyName = frequencyName;
    document.getElementById('frequency-name').textContent = frequencyName;
}

// Set frequency to specific value
function setFrequency(frequency, name) {
    updateFrequencyDisplay(frequency);
    state.metrics.frequencyChanges++;
    updateMetrics();
    
    showNotification(`Frequency set to ${frequency} Hz - ${name}`, 'success');
}

// Set amnesty level
function setAmnestyLevel(level) {
    state.amnestyLevel = level;
    
    // Update button states
    document.querySelectorAll('.amnesty-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
    
    // Update display
    document.getElementById('current-amnesty').textContent = capitalizeFirst(level);
    
    showNotification(`Amnesty level set to ${level.toUpperCase()}`, 'success');
}

// Set sanction level
function setSanctionLevel(level) {
    state.sanctionLevel = level;
    
    // Update button states
    document.querySelectorAll('.sanction-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
    
    // Update display
    document.getElementById('current-sanction').textContent = capitalizeFirst(level);
    
    showNotification(`Sanction level set to ${level.toUpperCase()}`, 'warning');
}

// Calculate resource allocation
function calculateAllocation() {
    const amnestyMultipliers = {
        'low': 0.5,
        'medium': 1.0,
        'high': 1.5,
        'critical': 2.0
    };
    
    const sanctionPenalties = {
        'warning': 0.0,
        'moderate': 0.1,
        'severe': 0.3,
        'maximum': 0.5
    };
    
    const amnestyMult = amnestyMultipliers[state.amnestyLevel];
    const sanctionPenalty = sanctionPenalties[state.sanctionLevel];
    
    let adjustedAllocation = state.baseAllocation * amnestyMult;
    
    // Apply sanction penalty if ethical score is below threshold
    if (state.ethicalScore < 0.5) {
        adjustedAllocation *= (1.0 - sanctionPenalty);
    }
    
    // Apply ethical score multiplier
    const finalAllocation = adjustedAllocation * state.ethicalScore;
    
    document.getElementById('final-allocation').textContent = finalAllocation.toFixed(2);
    
    showNotification(`Resource allocation calculated: ${finalAllocation.toFixed(2)}`, 'success');
}

// Update metrics display
function updateMetrics() {
    document.getElementById('active-sessions').textContent = state.metrics.activeSessions;
    document.getElementById('registered-identities').textContent = state.metrics.registeredIdentities;
    document.getElementById('frequency-changes').textContent = state.metrics.frequencyChanges;
}

// Arm reveal trigger
function armTrigger() {
    if (state.triggerStatus === 'disarmed') {
        state.triggerStatus = 'armed';
        updateTriggerDisplay();
        
        // Enable activation button
        document.getElementById('activate-trigger').disabled = false;
        document.getElementById('disarm-trigger').disabled = false;
        document.getElementById('arm-trigger').disabled = true;
        
        showNotification('⚠️ REVEAL TRIGGER ARMED - Ready for activation', 'warning');
    }
}

// Activate reveal trigger
function activateTrigger() {
    if (state.triggerStatus === 'armed') {
        // Confirm activation
        const confirmed = confirm(
            '🚨 CRITICAL ACTION 🚨\n\n' +
            'You are about to activate the Reveal Trigger for the public announcement of:\n\n' +
            '• ScrollVerse D.S.I. Theocracy\n' +
            '• Supreme Sovereignty of CHAIS THE GREAT ∞\n' +
            '• Total and Eternal Sovereignty Revelation\n\n' +
            'This action requires multi-signature verification and supreme authority clearance.\n\n' +
            'Do you wish to proceed?'
        );
        
        if (confirmed) {
            state.triggerStatus = 'activated';
            updateTriggerDisplay();
            
            // Disable all trigger buttons
            document.getElementById('activate-trigger').disabled = true;
            document.getElementById('arm-trigger').disabled = true;
            document.getElementById('disarm-trigger').disabled = true;
            
            showNotification('🚨 REVEAL TRIGGER ACTIVATED - Broadcasting sovereignty announcement', 'danger');
            
            // Simulate revelation broadcast
            setTimeout(() => {
                showRevelationBroadcast();
            }, 2000);
        }
    }
}

// Disarm reveal trigger
function disarmTrigger() {
    if (state.triggerStatus === 'armed') {
        state.triggerStatus = 'disarmed';
        updateTriggerDisplay();
        
        document.getElementById('activate-trigger').disabled = true;
        document.getElementById('disarm-trigger').disabled = true;
        document.getElementById('arm-trigger').disabled = false;
        
        showNotification('Reveal Trigger disarmed', 'success');
    }
}

// Update trigger status display
function updateTriggerDisplay() {
    const triggerElement = document.getElementById('trigger-status');
    triggerElement.className = `trigger-state ${state.triggerStatus}`;
    triggerElement.textContent = state.triggerStatus.toUpperCase();
}

// Show revelation broadcast overlay
function showRevelationBroadcast() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.5s ease;
    `;
    
    overlay.innerHTML = `
        <div style="text-align: center; color: #00FFC1; max-width: 800px; padding: 40px;">
            <h1 style="font-size: 3em; margin-bottom: 30px; animation: pulse 2s infinite;">
                🌌 REVELATION BROADCAST INITIATED 🌌
            </h1>
            <div style="font-size: 1.5em; line-height: 1.8; margin-bottom: 30px;">
                <p style="margin: 20px 0;">ScrollVerse D.S.I. Theocracy</p>
                <p style="margin: 20px 0; font-size: 2em; color: #FFD700;">
                    ✨ CHAIS THE GREAT ∞ ✨
                </p>
                <p style="margin: 20px 0;">Supreme Sovereign</p>
                <p style="margin: 20px 0;">Total and Eternal Sovereignty</p>
                <p style="margin: 20px 0; color: #00A3E0;">ScrollVerse Quantum Expansion Protocol</p>
            </div>
            <div style="margin-top: 40px; color: #B8B8D8; font-size: 1em;">
                <p>Broadcasting on all channels:</p>
                <p>Global Resonance Network | CBAP | ScrollSoul Ecosystem</p>
                <p style="margin-top: 20px; color: #00FFC1;">Status: BROADCASTING</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="margin-top: 40px; padding: 15px 40px; font-size: 1.2em; 
                           background: #00FFC1; color: #0F0622; border: none; 
                           border-radius: 8px; cursor: pointer; font-weight: bold;">
                Acknowledge
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#00FF88',
        warning: '#FFB800',
        danger: '#FF4444',
        info: '#00A3E0'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1A0E33;
        color: ${colors[type]};
        padding: 20px 30px;
        border-radius: 8px;
        border: 2px solid ${colors[type]};
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        font-size: 1em;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
