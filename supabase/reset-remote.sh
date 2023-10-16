#!/bin/sh
source .env
supabase db reset --db-url $DATABASE_URL --debug
