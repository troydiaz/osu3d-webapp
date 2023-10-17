#!/bin/sh
source .env
supabase migration squash --db-url $DATABASE_URL