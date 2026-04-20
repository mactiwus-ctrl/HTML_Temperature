#!/bin/bash
# Setup script for PLC Temperature Monitor
# Siemens LOGO! 8.4 — VM1 @ 192.168.10.254

set -e

echo "=== PLC Temperature Monitor Setup ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Install Node.js 18+ first."
    exit 1
fi

echo "Node.js: $(node -v)"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install
echo ""

# Build
echo "Building project..."
npm run build
echo ""

echo "=== Setup Complete ==="
echo ""
echo "PLC Config:"
echo "  Host: 192.168.10.254"
echo "  Port: 102 (S7)"
echo "  Rack: 0, Slot: 2"
echo "  Address: VM1 (DB1,REAL0)"
echo ""
echo "Run:"
echo "  npm run dev    # development (http://localhost:3000)"
echo "  npm run start  # production  (http://localhost:3000)"
