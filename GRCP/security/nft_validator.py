"""
ScrollBond NFT Validator Module
Provides NFT-based authentication for GRCP operations
"""

import hashlib
import json
import os
from typing import Dict, Any, Optional
from datetime import datetime


class NFTValidator:
    """
    Validates ScrollBond NFT ownership for GRCP authentication.
    Integrates with blockchain networks for NFT verification.
    """
    
    def __init__(self, config_path: str = None):
        """Initialize the NFT Validator with configuration."""
        if config_path is None:
            config_path = os.path.join(os.path.dirname(__file__), '..', 'config', 'settings.json')
        
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        self.security_config = config['security']
        self.nft_standard = self.security_config['nft_contract_standard']
        self.verified_nfts = {}
        self.validation_history = []
        
    def register_nft(self, 
                    token_id: str,
                    owner_address: str,
                    contract_address: str,
                    metadata: dict = None) -> Dict[str, Any]:
        """
        Register a ScrollBond NFT in the validation system.
        
        Args:
            token_id: Unique NFT token identifier
            owner_address: Blockchain address of NFT owner
            contract_address: Smart contract address of NFT
            metadata: Optional NFT metadata
            
        Returns:
            Dict with registration status
        """
        if token_id in self.verified_nfts:
            return {
                'success': False,
                'error': 'NFT already registered'
            }
        
        # Create NFT record
        nft_hash = self._generate_nft_hash(token_id, owner_address, contract_address)
        
        self.verified_nfts[token_id] = {
            'owner_address': owner_address,
            'contract_address': contract_address,
            'nft_hash': nft_hash,
            'standard': self.nft_standard,
            'metadata': metadata or {},
            'registered': datetime.utcnow().isoformat(),
            'status': 'active'
        }
        
        return {
            'success': True,
            'token_id': token_id,
            'nft_hash': nft_hash,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def validate_nft_ownership(self,
                              token_id: str,
                              owner_address: str) -> Dict[str, Any]:
        """
        Validate NFT ownership for authentication.
        
        Args:
            token_id: NFT token ID to validate
            owner_address: Address claiming ownership
            
        Returns:
            Dict with validation status
        """
        if token_id not in self.verified_nfts:
            return {
                'valid': False,
                'error': 'NFT not registered in system'
            }
        
        nft_record = self.verified_nfts[token_id]
        
        # Check if the provided address matches the registered owner
        if nft_record['owner_address'].lower() != owner_address.lower():
            self._log_validation('failed', token_id, owner_address, 'Owner mismatch')
            return {
                'valid': False,
                'error': 'NFT ownership verification failed'
            }
        
        # Check NFT status
        if nft_record['status'] != 'active':
            self._log_validation('failed', token_id, owner_address, 'NFT not active')
            return {
                'valid': False,
                'error': f'NFT status: {nft_record["status"]}'
            }
        
        self._log_validation('success', token_id, owner_address, 'Validated')
        
        return {
            'valid': True,
            'token_id': token_id,
            'owner_address': owner_address,
            'contract_address': nft_record['contract_address'],
            'metadata': nft_record['metadata'],
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def verify_nft_signature(self,
                           token_id: str,
                           message: str,
                           signature: str) -> Dict[str, Any]:
        """
        Verify a cryptographic signature from an NFT holder.
        
        Args:
            token_id: NFT token ID
            message: Message that was signed
            signature: Cryptographic signature
            
        Returns:
            Dict with signature verification status
        """
        if token_id not in self.verified_nfts:
            return {
                'verified': False,
                'error': 'NFT not registered'
            }
        
        nft_record = self.verified_nfts[token_id]
        
        # In production, this would verify the signature using blockchain libraries
        # For now, we simulate the verification
        expected_signature = self._generate_signature(
            token_id,
            nft_record['owner_address'],
            message
        )
        
        if signature != expected_signature:
            return {
                'verified': False,
                'error': 'Signature verification failed'
            }
        
        return {
            'verified': True,
            'token_id': token_id,
            'message': message,
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def get_nft_info(self, token_id: str) -> Dict[str, Any]:
        """
        Get information about a registered NFT.
        
        Args:
            token_id: NFT token ID
            
        Returns:
            Dict with NFT information
        """
        if token_id not in self.verified_nfts:
            return {
                'found': False,
                'error': 'NFT not registered'
            }
        
        nft_record = self.verified_nfts[token_id].copy()
        # Remove sensitive hash for external queries
        nft_record.pop('nft_hash', None)
        
        return {
            'found': True,
            'token_id': token_id,
            'info': nft_record
        }
    
    def revoke_nft(self, token_id: str, reason: str = None) -> Dict[str, Any]:
        """
        Revoke an NFT's authentication privileges.
        
        Args:
            token_id: NFT token ID to revoke
            reason: Optional reason for revocation
            
        Returns:
            Dict with revocation status
        """
        if token_id not in self.verified_nfts:
            return {
                'success': False,
                'error': 'NFT not registered'
            }
        
        self.verified_nfts[token_id]['status'] = 'revoked'
        self.verified_nfts[token_id]['revoked_at'] = datetime.utcnow().isoformat()
        
        if reason:
            self.verified_nfts[token_id]['revocation_reason'] = reason
        
        self._log_validation('revoked', token_id, None, reason or 'Manual revocation')
        
        return {
            'success': True,
            'token_id': token_id,
            'status': 'revoked',
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _generate_nft_hash(self,
                          token_id: str,
                          owner_address: str,
                          contract_address: str) -> str:
        """Generate a unique hash for NFT verification."""
        data = f"{token_id}:{owner_address}:{contract_address}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _generate_signature(self,
                          token_id: str,
                          owner_address: str,
                          message: str) -> str:
        """Generate a simulated signature for testing."""
        data = f"{token_id}:{owner_address}:{message}"
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _log_validation(self,
                       result: str,
                       token_id: str,
                       address: Optional[str],
                       details: str):
        """Log validation attempts for audit trail."""
        self.validation_history.append({
            'timestamp': datetime.utcnow().isoformat(),
            'result': result,
            'token_id': token_id,
            'address': address,
            'details': details
        })
    
    def get_validation_history(self, limit: int = 10) -> list:
        """
        Get recent validation history.
        
        Args:
            limit: Maximum number of historical entries to return
            
        Returns:
            List of recent validation attempts
        """
        return self.validation_history[-limit:]
    
    def get_validator_status(self) -> Dict[str, Any]:
        """
        Get comprehensive status of the NFT Validator.
        
        Returns:
            Dict with validator status information
        """
        active_nfts = sum(
            1 for nft in self.verified_nfts.values()
            if nft['status'] == 'active'
        )
        
        revoked_nfts = sum(
            1 for nft in self.verified_nfts.values()
            if nft['status'] == 'revoked'
        )
        
        return {
            'nft_standard': self.nft_standard,
            'total_registered': len(self.verified_nfts),
            'active_nfts': active_nfts,
            'revoked_nfts': revoked_nfts,
            'validation_attempts': len(self.validation_history),
            'status': 'operational',
            'timestamp': datetime.utcnow().isoformat()
        }


if __name__ == '__main__':
    # Example usage
    validator = NFTValidator()
    
    # Register a ScrollBond NFT
    result = validator.register_nft(
        token_id='SCROLLBOND_001',
        owner_address='0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        contract_address='0x1234567890abcdef1234567890abcdef12345678',
        metadata={'type': 'Supreme Sovereignty', 'level': 10}
    )
    print(f"Registration: {result}")
    
    # Validate NFT ownership
    validation = validator.validate_nft_ownership(
        'SCROLLBOND_001',
        '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    )
    print(f"Validation: {validation}")
    
    # Get validator status
    status = validator.get_validator_status()
    print(f"Validator status: {status}")
