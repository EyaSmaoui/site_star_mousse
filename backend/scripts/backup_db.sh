#!/usr/bin/env bash
# Simple MongoDB backup script using mongodump
# Usage: ./backup_db.sh "$MONGO_URI" ./backups

URI=${1:-$URL_MONGODB}
OUT=${2:-./backups}

if ! command -v mongodump >/dev/null 2>&1; then
  echo "mongodump not found. Install MongoDB Database Tools or run backup manually." >&2
  exit 2
fi

if [ -z "$URI" ]; then
  echo "MongoDB URI not provided. Set URL_MONGODB or pass as first arg." >&2
  exit 2
fi

timestamp=$(date +%Y%m%d_%H%M%S)
dest="$OUT/dump_$timestamp"
mkdir -p "$dest"

mongodump --uri="$URI" --archive="$dest/dump.archive" --gzip
if [ $? -eq 0 ]; then
  echo "Backup saved to $dest/dump.archive"
else
  echo "mongodump failed" >&2
  exit 1
fi
