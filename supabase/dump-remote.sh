#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL
npx supabase db dump -f supabase/dumped.sql --db-url $DATABASE_URL --role-only --debug