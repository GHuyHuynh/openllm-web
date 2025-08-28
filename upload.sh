#!/bin/bash

set -e

echo "Building the application..."
pnpm build

echo "Uploading to Dal Timberlea server..."
read -p "Enter server hostname (e.g., timberlea.cs.dal.ca): " SERVER
read -p "Enter username: " USERNAME

scp -r openllm/ ${USERNAME}@${SERVER}:/users/cs/${USERNAME}/public_html/

echo "Setting file permissions..."
echo " Setting directory permissions..."
ssh ${USERNAME}@${SERVER} "find /users/cs/${USERNAME}/public_html/openllm -type d -exec chmod 755 {} \;"
echo " Setting file permissions..."
ssh ${USERNAME}@${SERVER} "find /users/cs/${USERNAME}/public_html/openllm -type f -exec chmod 644 {} \;"

echo "Upload complete"