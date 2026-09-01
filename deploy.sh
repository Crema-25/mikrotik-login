#!/bin/bash

###############################################
# ZANOON HOTSPOT DEPLOYMENT SCRIPT
# MikroTik RouterOS 7.25+ Installation
###############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ROUTER_IP="${1:-}"
ROUTER_USER="${2:-admin}"
ROUTER_PASSWORD="${3:-}"
HOTSPOT_DIR="/flash/hotspot/zanoon"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

###############################################
# FUNCTIONS
###############################################

print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   ZANOON HOTSPOT DEPLOYMENT SCRIPT     ║${NC}"
    echo -e "${BLUE}║   MikroTik RouterOS 7.25+              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_requirements() {
    print_info "Checking requirements..."
    
    # Check for required commands
    local required_commands=("scp" "ssh" "find")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            print_error "$cmd is not installed. Please install $cmd and try again."
            exit 1
        fi
    done
    
    # Check Router IP
    if [ -z "$ROUTER_IP" ]; then
        print_error "Router IP address is required."
        echo ""
        echo "Usage: $0 <router-ip> [username] [password]"
        echo ""
        echo "Examples:"
        echo "  $0 192.168.1.1"
        echo "  $0 192.168.1.1 admin"
        echo "  $0 192.168.1.1 admin password123"
        exit 1
    fi
    
    # Check if local files exist
    if [ ! -f "$LOCAL_DIR/login.html" ]; then
        print_error "login.html not found in $LOCAL_DIR"
        exit 1
    fi
    
    print_success "All requirements met"
}

test_ssh_connection() {
    print_info "Testing SSH connection to $ROUTER_IP..."
    
    if ssh -o ConnectTimeout=5 "$ROUTER_USER@$ROUTER_IP" "hostname" &>/dev/null; then
        print_success "SSH connection successful"
        return 0
    else
        print_error "Cannot connect to $ROUTER_IP via SSH"
        echo ""
        print_info "Make sure:"
        echo "  1. Router IP is correct: $ROUTER_IP"
        echo "  2. SSH is enabled on router"
        echo "  3. Username is correct: $ROUTER_USER"
        echo "  4. No firewall blocking SSH (port 22)"
        exit 1
    fi
}

check_router_version() {
    print_info "Checking RouterOS version..."
    
    local version=$(ssh "$ROUTER_USER@$ROUTER_IP" "/system/package/update/check-for-updates" 2>/dev/null | grep "current-version" | head -1)
    
    if [ -z "$version" ]; then
        version=$(ssh "$ROUTER_USER@$ROUTER_IP" "/system identity print" 2>/dev/null | grep name)
    fi
    
    print_success "Router info: $version"
}

create_remote_directory() {
    print_info "Creating remote directory structure..."
    
    ssh "$ROUTER_USER@$ROUTER_IP" "mkdir -p $HOTSPOT_DIR/css" || true
    ssh "$ROUTER_USER@$ROUTER_IP" "mkdir -p $HOTSPOT_DIR/js" || true
    ssh "$ROUTER_USER@$ROUTER_IP" "mkdir -p $HOTSPOT_DIR/assets" || true
    
    print_success "Remote directories created"
}

upload_files() {
    print_info "Uploading files to router..."
    
    # Upload HTML files
    local files=("login.html" "status.html" "logout.html" "error.html" "redirect.html")
    for file in "${files[@]}"; do
        if [ -f "$LOCAL_DIR/$file" ]; then
            scp "$LOCAL_DIR/$file" "$ROUTER_USER@$ROUTER_IP:$HOTSPOT_DIR/$file"
            print_success "Uploaded $file"
        else
            print_warning "File not found: $file"
        fi
    done
    
    # Upload CSS
    if [ -f "$LOCAL_DIR/css/style.css" ]; then
        scp "$LOCAL_DIR/css/style.css" "$ROUTER_USER@$ROUTER_IP:$HOTSPOT_DIR/css/style.css"
        print_success "Uploaded CSS"
    fi
    
    # Upload JavaScript
    if [ -f "$LOCAL_DIR/js/app.js" ]; then
        scp "$LOCAL_DIR/js/app.js" "$ROUTER_USER@$ROUTER_IP:$HOTSPOT_DIR/js/app.js"
        print_success "Uploaded JavaScript"
    fi
    
    # Upload Assets
    if [ -f "$LOCAL_DIR/assets/logo.svg" ]; then
        scp "$LOCAL_DIR/assets/logo.svg" "$ROUTER_USER@$ROUTER_IP:$HOTSPOT_DIR/assets/logo.svg"
        print_success "Uploaded logo"
    fi
}

verify_uploads() {
    print_info "Verifying uploaded files..."
    
    local file_count=$(ssh "$ROUTER_USER@$ROUTER_IP" "find $HOTSPOT_DIR -type f | wc -l" 2>/dev/null)
    
    if [ "$file_count" -ge 8 ]; then
        print_success "All files verified ($file_count files found)"
    else
        print_warning "Expected 8+ files, found $file_count"
    fi
    
    # List files
    echo ""
    print_info "Files on router:"
    ssh "$ROUTER_USER@$ROUTER_IP" "find $HOTSPOT_DIR -type f" | sed 's/^/  /'
}

configure_mikrotik() {
    print_info "Generating MikroTik configuration commands..."
    
    cat > "/tmp/zanoon-hotspot-config.rsc" << 'EOF'
# Zanoon HotSpot Configuration
# Add this to your HotSpot profile

# Note: Replace [profile-name] with your actual profile name
# Example: /ip hotspot profile set [ find name="hsprof1" ] ...

/ip hotspot profile set [ find name="hsprof1" ] \
    login-path="/flash/hotspot/zanoon/login.html" \
    status-path="/flash/hotspot/zanoon/status.html" \
    logout-path="/flash/hotspot/zanoon/logout.html" \
    error-path="/flash/hotspot/zanoon/error.html"

# Optional: Set additional profile options
/ip hotspot profile set [ find name="hsprof1" ] \
    dns-name="zanoon.local" \
    protocol="http" \
    domain="*"
EOF
    
    echo ""
    print_success "Configuration template generated"
    echo ""
    echo "To apply configuration:"
    echo "1. Export from MikroTik: /ip hotspot profile print terse"
    echo "2. Note the profile name (usually hsprof1)"
    echo "3. SSH to router: ssh admin@$ROUTER_IP"
    echo "4. Edit profile paths to: $HOTSPOT_DIR/login.html etc."
    echo ""
    print_warning "Manual configuration required - see instructions above"
}

print_completion_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   DEPLOYMENT COMPLETE!                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    print_success "Files uploaded to: $HOTSPOT_DIR"
    echo ""
    print_info "Next steps:"
    echo "1. SSH to router: ssh admin@$ROUTER_IP"
    echo "2. Configure HotSpot profile:"
    echo "   /ip hotspot profile set [ find name=\"[profile]\" ] \\"
    echo "     login-path=\"$HOTSPOT_DIR/login.html\" \\"
    echo "     status-path=\"$HOTSPOT_DIR/status.html\" \\"
    echo "     logout-path=\"$HOTSPOT_DIR/logout.html\" \\"
    echo "     error-path=\"$HOTSPOT_DIR/error.html\""
    echo ""
    echo "3. Restart HotSpot service:"
    echo "   /ip hotspot stop"
    echo "   /ip hotspot start"
    echo ""
    print_info "Test the portal:"
    echo "1. Connect to WiFi network"
    echo "2. Open any website in browser"
    echo "3. Should redirect to login page"
    echo ""
    
    echo -e "${BLUE}Support: zanoon752@gmail.com${NC}"
    echo -e "${BLUE}Phone: +261 38 01 347 54${NC}"
    echo ""
}

###############################################
# MAIN EXECUTION
###############################################

main() {
    print_header
    
    check_requirements
    test_ssh_connection
    check_router_version
    
    echo ""
    print_info "Starting deployment..."
    echo ""
    
    create_remote_directory
    upload_files
    verify_uploads
    
    echo ""
    configure_mikrotik
    
    print_completion_summary
}

# Run main function
main "$@"
