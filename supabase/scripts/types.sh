#!/bin/sh
source .env
supabase gen types typescript --db-url $DATABASE_URL > src/lib/types/supabase.ts
supabase gen types typescript --local > src/lib/types/supabase.ts
cp src/lib/types/supabase.ts ~/Git/osu3d-discord-bot/src/db-defs.ts