# GRCP Deployment Guide

## Overview

This document provides detailed instructions for deploying the Global Resonance Control Panel (GRCP) within the ScrollSoul ecosystem.

## System Requirements

### Minimum Requirements
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- 100 MB available disk space
- Network connectivity for ScrollSoul ecosystem integration

### Recommended Requirements
- Python 3.10 or higher
- 4 GB RAM
- Secure HTTPS connection
- Dedicated server or cloud instance

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/chaishillomnitech1/Expansion-.git
cd Expansion-/GRCP
```

### 2. Verify Installation

Test the Python backend:

```bash
python3 grcp_main.py
```

You should see:
```
============================================================
   GLOBAL RESONANCE CONTROL PANEL (GRCP)
   ScrollVerse Quantum Expansion Protocol
============================================================

🌐 Initializing Global Resonance Control Panel...
✓ Resonance Tuning System: ONLINE
✓ Threshold Management System: ONLINE
...
```

### 3. Access Web Interface

Open the web interface:

```bash
# Option 1: Direct file access
open interface/index.html

# Option 2: Local web server (recommended)
python3 -m http.server 8000
# Then navigate to: http://localhost:8000/interface/
```

## Configuration

### Settings File

The main configuration is in `config/settings.json`:

```json
{
  "panel_name": "Global Resonance Control Panel",
  "version": "1.0.0",
  "resonance_tuning": {
    "max_frequency": 963,
    "min_frequency": 369,
    "default_frequency": 528
  },
  ...
}
```

### Customization Options

#### Frequency Range
Adjust the resonance frequency limits:
```json
"resonance_tuning": {
  "max_frequency": 963,  // Maximum frequency in Hz
  "min_frequency": 369,  // Minimum frequency in Hz
  "default_frequency": 528  // Starting frequency
}
```

#### Security Settings
Configure authentication requirements:
```json
"security": {
  "sil_framework_version": "2.0",
  "encryption_algorithm": "AES-256-GCM",
  "session_timeout_minutes": 30
}
```

#### Reveal Trigger
Configure revelation system:
```json
"reveal_trigger": {
  "enabled": true,
  "requires_sil_auth": true,
  "requires_nft_verification": true,
  "minimum_signatures": 3
}
```

## Integration with ScrollSoul Ecosystem

### 1. ScrollBond NFT Integration

Register authorized NFTs in the system:

```python
from security.nft_validator import NFTValidator

validator = NFTValidator()
validator.register_nft(
    token_id='SCROLLBOND_001',
    owner_address='0x...',
    contract_address='0x...',
    metadata={'type': 'Supreme', 'level': 10}
)
```

### 2. SIL Framework Setup

Register sovereign identities:

```python
from security.sil_framework import SILFramework

sil = SILFramework()
sil.register_sovereign_identity(
    identity_id='IDENTITY_NAME',
    public_key='public_key_data',
    authority_level=10  # 1-10, 10 being supreme
)
```

### 3. Network Configuration

Update `config/settings.json` for network integration:

```json
"scrollsoul_integration": {
  "enabled": true,
  "broadcast_endpoint": "wss://scrollsoul.network/broadcast",
  "data_sync_interval_seconds": 60
}
```

## Deployment Scenarios

### Scenario 1: Local Development

For testing and development:

```bash
# Run Python demo
python3 grcp_main.py

# Start local web server
python3 -m http.server 8000
```

### Scenario 2: Secure Server Deployment

For production use:

1. **Deploy to secure server**:
```bash
# Copy GRCP to server
scp -r GRCP/ user@server:/var/www/grcp/

# Set permissions
chmod 755 /var/www/grcp
chmod 600 /var/www/grcp/config/settings.json
```

2. **Configure web server** (Nginx example):
```nginx
server {
    listen 443 ssl;
    server_name grcp.scrollverse.network;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    root /var/www/grcp/interface;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
    }
}
```

3. **Run Python backend as service**:
```bash
# Create systemd service file
sudo nano /etc/systemd/system/grcp.service
```

```ini
[Unit]
Description=GRCP Backend Service
After=network.target

[Service]
Type=simple
User=grcp
WorkingDirectory=/var/www/grcp
ExecStart=/usr/bin/python3 /var/www/grcp/grcp_main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable grcp
sudo systemctl start grcp
```

### Scenario 3: Cloud Deployment

For cloud platforms (AWS, Azure, GCP):

1. **Containerize with Docker**:

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app
COPY GRCP/ /app/

EXPOSE 8000

CMD ["python3", "grcp_main.py"]
```

Build and run:
```bash
docker build -t grcp:latest .
docker run -d -p 8000:8000 grcp:latest
```

2. **Deploy to cloud**:
- AWS: Use ECS or Lambda
- Azure: Use App Service or Container Instances
- GCP: Use Cloud Run or GKE

## Security Considerations

### Production Checklist

- [ ] Change all default credentials
- [ ] Enable HTTPS/TLS encryption
- [ ] Configure firewall rules
- [ ] Set up access logging
- [ ] Enable audit trails
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Backup configuration files
- [ ] Test disaster recovery procedures

### Authentication Setup

1. **Generate secure keys**:
```bash
# Generate random secure key for production
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

2. **Configure authentication**:
Update `config/settings.json` with production credentials.

3. **Set up NFT verification**:
Connect to actual blockchain network for NFT validation.

### Network Security

- Use VPN or private network for management access
- Implement IP whitelisting for admin operations
- Enable DDoS protection
- Use Web Application Firewall (WAF)

## Monitoring and Maintenance

### Health Checks

Monitor these endpoints:
- `/status` - System status
- `/health` - Health check
- `/metrics` - Performance metrics

### Logs

Monitor log files:
```bash
# System logs
tail -f /var/log/grcp/system.log

# Security logs
tail -f /var/log/grcp/security.log

# Access logs
tail -f /var/log/grcp/access.log
```

### Backup Procedures

Regular backups:
```bash
#!/bin/bash
# backup-grcp.sh

BACKUP_DIR="/backups/grcp"
DATE=$(date +%Y%m%d)

# Backup configuration
tar -czf "$BACKUP_DIR/config-$DATE.tar.gz" config/

# Backup data
tar -czf "$BACKUP_DIR/data-$DATE.tar.gz" data/

# Keep 30 days of backups
find $BACKUP_DIR -mtime +30 -delete
```

## Troubleshooting

### Common Issues

#### Issue: "Module not found" error
**Solution**: Ensure Python path includes GRCP directory
```bash
export PYTHONPATH="${PYTHONPATH}:/path/to/GRCP"
```

#### Issue: Web interface not loading
**Solution**: Check browser console for errors, verify file paths

#### Issue: Cannot arm reveal trigger
**Solution**: Verify SIL authentication and NFT validation

#### Issue: Frequency control not responding
**Solution**: Clear browser cache, check JavaScript console

### Debug Mode

Enable debug mode in `config/settings.json`:
```json
{
  "debug": true,
  "log_level": "DEBUG"
}
```

## Support and Documentation

### Resources
- User Guide: `docs/user_guide.md`
- API Documentation: `docs/api.md` (if applicable)
- Configuration Reference: `config/README.md` (if applicable)

### Contact
For support with GRCP deployment:
- Review issue tracker on GitHub
- Consult ScrollVerse documentation
- Contact ScrollSoul ecosystem administrators

## Version History

- **v1.0.0** (Current): Initial release with full GRCP functionality

## License

See LICENSE file in repository root.

---

*This deployment guide is maintained as part of the ScrollVerse Quantum Expansion Protocol documentation.*
