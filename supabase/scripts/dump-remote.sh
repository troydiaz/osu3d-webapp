#!/bin/sh
source .env
supabase db dump -f supabase/dump/roles.sql --role-only
supabase db dump -f supabase/dump/data.sql --data-only
supabase db dump -f supabase/dump/schema.sql