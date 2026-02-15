#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
npm ci --production

echo "Running database setup..."
node src/db/setup-db.js

echo "Build complete."
