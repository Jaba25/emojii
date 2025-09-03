#!/bin/sh
set -e

# If no package.json, keep container alive and wait for scaffold
if [ ! -f package.json ]; then
  echo "No package.json found. Please scaffold the app inside the container, e.g.:"
  echo "  docker exec -it ionic_app bash -lc \"ionic start . blank --type=angular --no-git --no-link --quiet && npm install\""
  exec sleep infinity
fi

# Install dependencies if node_modules does not exist or is empty
if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the Ionic server
exec ionic serve --host=0.0.0.0 --port=8100 --livereload-port=35729 --external

