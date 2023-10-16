#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL
supabase gen types typescript --debug --db-url $DATABASE_URL > src/lib/types/supabase.ts