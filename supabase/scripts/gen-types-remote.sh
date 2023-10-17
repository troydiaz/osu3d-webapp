#!/bin/sh
source .env
supabase gen types typescript --db-url $DATABASE_URL > src/lib/types/supabase.ts