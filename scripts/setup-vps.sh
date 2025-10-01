#!/bin/bash

# ========================================
# VPS Initial Setup Script
# ========================================
# Run this script ONCE on fresh VPS
# Domain: travel-apps.claz.me
# VPS IP: 31.97.221.115
# ========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}→ $1${NC}"; }
print_section() {
    echo ""
    echo "======================================"
    echo "$1"
    echo "======================================"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root (use sudo)"
    exit 1
fi

print_section "🔧 VPS Initial Setup"

# Step 1: Update system
print_info "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Step 2: Install essential tools
print_info "Installing essential tools..."
apt install -y curl wget git build-essential ufw
print_success "Essential tools installed"

# Step 3: Install Node.js 20.x
print_info "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version
npm --version
print_success "Node.js installed"

# Step 4: Install PM2
print_info "Installing PM2 globally..."
npm install -g pm2
pm2 --version
print_success "PM2 installed"

# Step 5: Install Nginx
print_info "Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx
print_success "Nginx installed and started"

# Step 6: Install Certbot
print_info "Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx
print_success "Certbot installed"

# Step 7: Setup Firewall
print_info "Configuring firewall..."
ufw allow OpenSSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
ufw status
print_success "Firewall configured"

# Step 8: Create deploy user
print_info "Creating deploy user..."
if id "deployuser" &>/dev/null; then
    print_info "User deployuser already exists"
else
    adduser --gecos "" --disabled-password deployuser
    echo "deployuser:Deploy123!" | chpasswd
    usermod -aG sudo deployuser
    print_success "User deployuser created (password: Deploy123!)"
fi

# Step 9: Create app directory
print_info "Creating app directory..."
mkdir -p /home/deployuser/apps
chown -R deployuser:deployuser /home/deployuser/apps
print_success "App directory created"

print_section "✅ VPS Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Switch to deployuser: su - deployuser"
echo "2. Clone repository: cd /home/deployuser/apps && git clone <repo-url>"
echo "3. Follow DEPLOYMENT.md for remaining steps"
echo ""
echo "Important credentials:"
echo "- Deploy user: deployuser"
echo "- Deploy password: Deploy123!"
echo "- Please change this password: passwd"
