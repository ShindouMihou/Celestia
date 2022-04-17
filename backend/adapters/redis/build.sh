#!/bin/bash

echo "Docker Image: celebi-redis"
echo ""
echo "Task: Installing required local libraries..."
npm run libs
echo "Task: Building Docker Image"
docker build -t celebi-redis .