#!/bin/sh
export NODE_PORT=3000
node /vercel-listen.js &
exec /app/entrypoint.sh "$@"
