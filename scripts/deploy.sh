#!/bin/bash

# ========================================
# Travel Article App - Quick Deploy Script
# ========================================
# Domain: travel-apps.claz.me
# VPS IP: 31.97.221.115
# ========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="travel-apps.claz.me"
VPS_IP="31.97.221.115"
APP_NAME="travel-article-app"
APP_DIR="/home/deployuser/apps/travel-article-app"
NGINX_CONFIG="/etc/nginx/sites-available/travel-apps.claz.me"

# Helper functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

print_section() {
    echo ""
    echo "======================================"
    echo "$1"
    echo "======================================"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    print_error "Please do not run as root. Use deployuser instead."
    exit 1
fi

# Main deployment steps
main() {
    print_section "🚀 Starting Deployment for $DOMAIN"
    
    # Step 1: Pull latest changes
    print_info "Pulling latest changes from GitHub..."
    cd "$APP_DIR"
    git pull origin main
    print_success "Code updated"
    
    # Step 2: Install dependencies
    print_info "Installing dependencies..."
    npm install --legacy-peer-deps
    print_success "Dependencies installed"
    
    # Step 3: Build application
    print_info "Building application..."
    npm run build
    print_success "Build completed"
    
    # Step 4: Restart PM2
    print_info "Restarting application with PM2..."
    pm2 restart $APP_NAME
    print_success "Application restarted"
    
    # Step 5: Check PM2 status
    print_info "Checking application status..."
    pm2 status
    
    # Step 6: Show recent logs
    print_info "Recent logs:"
    pm2 logs $APP_NAME --lines 20 --nostream
    
    print_section "✅ Deployment Complete!"
    echo ""
    echo "Your application is now live at:"
    echo "https://$DOMAIN"
    echo ""
    echo "Monitor logs with: pm2 logs $APP_NAME"
    echo "Check status with: pm2 status"
}

# Run main function
main
