#!/bin/bash

# Install Python
apt-get update
apt-get install -y python3 python3-pip

# Create symbolic link for python command
ln -s /usr/bin/python3 /usr/bin/python

# Navigate to server directory
cd server

# Install Node.js dependencies
npm install

# Build TypeScript
npm run build

# Create temp directory for code execution
mkdir -p temp

echo "Build completed successfully!"
