#!/bin/bash
# filepath: kill_ports.sh

for port in 3000 5001; do
  echo "Killing processes on port $port..."
  fuser -k ${port}/tcp
done

echo "Done."