#!/bin/sh
source .env
supabase db push --db-url $DATABASE_URL