#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL
npx supabase gen types typescript --db-url $DATABASE_URL > src/lib/types/supabase.ts