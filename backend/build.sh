#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Collect static assets
python manage.py collectstatic --no-input

# Apply database schema migrations
python manage.py migrate

# Seed catalog & dynamic store settings
python manage.py seed_db
