#!/bin/sh

source .env
source .env.prod

echo $DATABASE_URL

cloudflared access tcp --hostname $REMOTE_DB_URL --url localhost:50555 &
pid=$!
sleep 1

npx supabase db push --db-url $DATABASE_URL --debug

kill $pid