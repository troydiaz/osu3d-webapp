#!/bin/sh
set -e
source .env

# Create timestamp
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
DEST_DIR="supabase/dump/$TIMESTAMP"
mkdir -p "$DEST_DIR"

# Dump the database
supabase db dump -f "$DEST_DIR/roles.sql" --role-only
supabase db dump -f "$DEST_DIR/data.sql" --data-only
supabase db dump -f "$DEST_DIR/schema.sql"

# Append timestamp to history log
echo "$TIMESTAMP" >> supabase/dump/history.csv

echo "Dump completed at $TIMESTAMP, logged to history.csv"