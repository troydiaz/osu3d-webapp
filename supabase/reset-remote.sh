#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL
npx supabase db reset --db-url $DATABASE_URL --debug