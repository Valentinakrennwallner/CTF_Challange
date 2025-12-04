#!/bin/sh
set -e

# Small debug hint to confirm the entrypoint is executed inside the container
echo "🔔 entrypoint.sh running (PID $$)"

# If DB_INIT=true in the container environment, run reset + seed.
if [ "$DB_INIT" = "true" ]; then
  echo "🔧 DB_INIT=true — running database reset and seed"
  npm run db:reset || echo "⚠️  db:reset failed"
  npm run db:seed  || echo "⚠️  db:seed failed"
else
  echo "ℹ️  DB_INIT not enabled — skipping database reset/seed"
fi

# Start the application (dev by default; change if you need production start)
exec npm run dev
