# Omnitech1 Setup Guide

## Quick Start

Get up and running with Omnitech1 infrastructure in 5 minutes.

### Prerequisites

Before you begin, ensure you have:

- **Git** (version 2.30 or higher)
  ```bash
  git --version
  ```

- **Bash** shell environment
  ```bash
  echo $SHELL
  ```

- **GitHub account** with repository access

- **GitHub CLI** (optional but recommended)
  ```bash
  gh --version
  ```

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/chaishillomnitech1/Expansion-.git
cd Expansion-
```

#### 2. Verify Installation

Run the health check to verify everything is set up correctly:

```bash
chmod +x scripts/*.sh
./scripts/health-check.sh
```

Expected output:
```
======================================
  Omnitech1 Health Check
======================================

[1/5] Repository Health Check
  ✓ Git repository initialized
  ✓ Current branch: main
  ✓ Total commits: X

[2/5] Workflow Configuration Check
  ✓ Workflows directory exists
  ✓ Total workflow files: X
  ...

======================================
Health Check Complete
======================================
```

#### 3. Run Diagnostics

Generate a comprehensive diagnostic report:

```bash
./scripts/diagnostics.sh
```

This will:
- Collect system information
- Analyze repository metrics
- Check workflow configurations
- Generate a report in `logs/diagnostics_*.log`

#### 4. Test Deployment (Validation Only)

Run the deployment script to validate your setup:

```bash
./scripts/deploy.sh
```

## Detailed Configuration

### GitHub Actions Setup

#### 1. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Actions** → **General**
3. Under "Actions permissions", select "Allow all actions and reusable workflows"
4. Click **Save**

#### 2. Configure Secrets (if needed)

For enhanced functionality, you may need to set up GitHub Secrets:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add required secrets (e.g., API keys, tokens)

**Note**: The current infrastructure works without additional secrets for basic functionality.

#### 3. Branch Protection Rules (Recommended)

Protect your main branch:

1. Go to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Enter `main` as the branch name pattern
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
5. Click **Create**

### Workflow Configuration

#### Customizing Workflows

Edit workflow files in `.github/workflows/` to customize behavior:

**Example: Change CI/CD trigger branches**

Edit `.github/workflows/ci-cd.yml`:

```yaml
on:
  push:
    branches:
      - main
      - develop      # Add your custom branch
      - staging      # Add more as needed
```

**Example: Adjust security scan frequency**

Edit `.github/workflows/security-audit.yml`:

```yaml
schedule:
  - cron: '0 2 * * *'  # Daily at 2 AM UTC
  # Change to: '0 */6 * * *'  # Every 6 hours
```

### Script Configuration

#### Customizing Scripts

Scripts are located in `scripts/` directory. To customize:

1. **Edit the script**:
   ```bash
   nano scripts/health-check.sh
   ```

2. **Test your changes**:
   ```bash
   ./scripts/health-check.sh
   ```

3. **Commit the changes**:
   ```bash
   git add scripts/health-check.sh
   git commit -m "Customize health check script"
   git push
   ```

## Usage Guide

### Running Health Checks

**Manual execution**:
```bash
./scripts/health-check.sh
```

**Automated execution**: Health checks run automatically on every push via the CI/CD workflow.

### Running Diagnostics

**Generate a diagnostic report**:
```bash
./scripts/diagnostics.sh
```

**View the latest report**:
```bash
cat logs/diagnostics_*.log | tail -50
```

**List all reports**:
```bash
ls -lh logs/
```

### Deploying Changes

**Automatic deployment**:
- Push to the `main` branch triggers the CI/CD pipeline
- All validations run automatically
- Deployment validation occurs if all tests pass

**Manual validation**:
```bash
./scripts/deploy.sh
```

### Running Tests

**Trigger integration tests manually**:
```bash
# Using GitHub CLI
gh workflow run integration-tests.yml

# Or via GitHub web interface:
# Actions → Integration Tests → Run workflow
```

**View test results**:
```bash
# Using GitHub CLI
gh run list --workflow=integration-tests.yml

# View specific run
gh run view <run-id>
```

### AI Collaboration Demo

**Run the AI collaboration demonstration**:

1. Go to **Actions** → **AI Collaboration Demo**
2. Click **Run workflow**
3. Select collaboration type:
   - `distributed-analysis`
   - `strength-amplification`
   - `problem-solving`
   - `optimization`
4. Enter input data (optional)
5. Click **Run workflow**

**View results**:
- Check the workflow summary for aggregated results
- Download artifacts for detailed reports

### Security Audits

**Run security audit manually**:
```bash
# Using GitHub CLI
gh workflow run security-audit.yml
```

**Schedule changes**:
Edit `.github/workflows/security-audit.yml` to change the schedule.

**View audit reports**:
1. Go to **Actions** → **Security Audit**
2. Click on the latest run
3. Download the `security-audit-report` artifact

### Performance Monitoring

**View performance metrics**:
1. Go to **Actions** → **Performance Monitoring**
2. Click on the latest run
3. Check the workflow summary for metrics
4. Download `performance-report` artifact for details

## Advanced Configuration

### Customizing Log Output

**Change log directory**:

Edit `scripts/diagnostics.sh`:
```bash
LOG_DIR="logs"  # Change to your preferred directory
```

**Change log retention**:

Add to `.gitignore` if needed, or create a cleanup script:
```bash
#!/bin/bash
# cleanup-logs.sh
find logs/ -name "*.log" -mtime +30 -delete  # Delete logs older than 30 days
```

### Adding Custom Workflows

**Create a new workflow**:

1. Create file `.github/workflows/my-workflow.yml`:
```yaml
name: My Custom Workflow

on:
  workflow_dispatch:

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: My Step
        run: echo "Hello from my workflow"
```

2. Test the workflow:
```bash
gh workflow run my-workflow.yml
```

### Integrating with External Services

**Webhook integration example**:

```bash
# Send notification on workflow completion
curl -X POST https://your-webhook-url.com/notify \
  -H "Content-Type: application/json" \
  -d '{"status":"completed","workflow":"ci-cd"}'
```

Add this to your workflow:
```yaml
- name: Send Notification
  if: always()
  run: |
    curl -X POST ${{ secrets.WEBHOOK_URL }} \
      -H "Content-Type: application/json" \
      -d '{"status":"${{ job.status }}","workflow":"${{ github.workflow }}"}'
```

## Troubleshooting

### Common Issues

#### Issue: Scripts not executable

**Symptoms**:
```
bash: ./scripts/health-check.sh: Permission denied
```

**Solution**:
```bash
chmod +x scripts/*.sh
```

#### Issue: YAML syntax errors

**Symptoms**:
```
Invalid workflow file
```

**Solution**:
Validate YAML syntax:
```bash
python3 -c "
import yaml
with open('.github/workflows/ci-cd.yml', 'r') as f:
    yaml.safe_load(f)
print('YAML is valid')
"
```

#### Issue: Workflow not triggering

**Symptoms**: Workflow doesn't run on push

**Solution**:
1. Check workflow file location (must be in `.github/workflows/`)
2. Verify trigger configuration:
```yaml
on:
  push:
    branches:
      - main  # Ensure this matches your branch name
```
3. Ensure GitHub Actions is enabled in repository settings

#### Issue: Failed security scan

**Symptoms**: Security audit workflow fails

**Solution**:
1. Review the security report artifact
2. Check for actual hardcoded secrets
3. If false positives, update patterns in the workflow
4. Document exceptions in comments

#### Issue: Missing dependencies

**Symptoms**: Scripts fail with "command not found"

**Solution**:
Install required tools:
```bash
# For Ubuntu/Debian
sudo apt-get update
sudo apt-get install git python3 python3-pip

# For macOS
brew install git python3
```

### Debugging Workflows

#### Enable debug logging

Add to repository secrets:
- `ACTIONS_STEP_DEBUG` = `true`
- `ACTIONS_RUNNER_DEBUG` = `true`

#### View workflow logs

```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id> --log

# Download logs
gh run download <run-id>
```

#### Test workflows locally

Use [act](https://github.com/nektos/act):
```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow locally
act -W .github/workflows/ci-cd.yml
```

### Performance Issues

#### Slow workflow execution

**Solutions**:
1. Add caching for dependencies
2. Use matrix strategies for parallel execution
3. Optimize script execution
4. Remove unnecessary steps

#### Large artifact sizes

**Solutions**:
1. Compress artifacts before upload
2. Reduce artifact retention period
3. Clean up old artifacts regularly

### Getting Help

#### Documentation

- **Infrastructure Docs**: `docs/README.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **AI Collaboration**: `docs/AI-COLLABORATION.md`
- **Security**: `SECURITY.md`

#### Support Channels

1. **GitHub Issues**: Report bugs or request features
2. **GitHub Discussions**: Ask questions and share ideas
3. **Documentation**: Check existing docs first

#### Useful Commands

```bash
# Check repository status
git status

# View recent commits
git log --oneline -10

# List all branches
git branch -a

# Check workflow status
gh run list

# View help for scripts
./scripts/health-check.sh --help  # (if implemented)
```

## Maintenance

### Regular Tasks

#### Weekly
- Review workflow execution logs
- Check security audit reports
- Monitor performance metrics

#### Monthly
- Update dependencies
- Review and clean up old artifacts
- Update documentation as needed

#### Quarterly
- Review and update workflows
- Assess system performance
- Plan improvements

### Updates

**Update scripts**:
1. Edit scripts in `scripts/` directory
2. Test thoroughly
3. Commit and push changes

**Update workflows**:
1. Edit workflows in `.github/workflows/`
2. Test with `workflow_dispatch` trigger first
3. Merge to main after validation

**Update documentation**:
1. Edit files in `docs/`
2. Keep examples up to date
3. Update version numbers

## Best Practices

### Development
- ✅ Test locally before pushing
- ✅ Use descriptive commit messages
- ✅ Create feature branches for changes
- ✅ Review your own changes before PR

### Security
- ✅ Never commit secrets
- ✅ Use GitHub Secrets for sensitive data
- ✅ Run security audits regularly
- ✅ Keep dependencies updated

### Operations
- ✅ Monitor workflow executions
- ✅ Review logs regularly
- ✅ Maintain documentation
- ✅ Backup important data

## Next Steps

After setup, consider:

1. **Customize workflows** for your specific needs
2. **Add custom scripts** for additional automation
3. **Integrate external services** via webhooks
4. **Expand AI collaboration** with custom specialists
5. **Contribute improvements** back to the project

---

**Need Help?**  
Check the [Architecture docs](ARCHITECTURE.md) or [raise an issue](https://github.com/chaishillomnitech1/Expansion-/issues)

**Version**: 1.0.0  
**Last Updated**: 2025-01-13
