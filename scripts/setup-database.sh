#!/bin/bash

# Database Setup Script
# Creates database and runs initial migrations

set -e

echo "🗄️  Setting up Threads of Hope Database..."

# Load environment variables
if [ -f backend/.env ]; then
  export $(cat backend/.env | grep -v '^#' | xargs)
else
  echo "Error: backend/.env file not found"
  exit 1
fi

# Create database if it doesn't exist
echo "Creating database..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -tc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1 || \
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -p $DB_PORT -c "CREATE DATABASE ${DB_NAME}"

echo "✅ Database created successfully"

# Run migrations
echo "Running migrations..."
cd backend
npm run migrate

echo "✅ Migrations completed"

# Seed initial data
read -p "Do you want to seed initial data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run seed
  echo "✅ Seeding completed"
fi

echo "✅ Database setup complete!"


