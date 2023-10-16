#!/bin/sh
source .env
supabase db dump -f supabase/dump/roles.sql --db-url $DATABASE_URL --role-only
supabase db dump -f supabase/dump/data.sql --db-url $DATABASE_URL --data-only
supabase db dump -f supabase/dump/schema.sql --db-url $DATABASE_URL