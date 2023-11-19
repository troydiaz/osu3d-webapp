#!/bin/sh
source .env
supabase migration up --db-url $DATABASE_URL --debug