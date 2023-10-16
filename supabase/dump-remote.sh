#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL

# cloudflared access tcp --hostname $REMOTE_DB_URL --url localhost:50555 &
# pid=$!
# sleep 1

supabase db dump -f supabase/dump/roles.sql --db-url $DATABASE_URL --role-only
supabase db dump -f supabase/dump/data.sql --db-url $DATABASE_URL --data-only
supabase db dump -f supabase/dump/schema.sql --db-url $DATABASE_URL

# kill $pid