#!/bin/bash

# Health check script for blog application

API_URL=${1:-http://localhost:4000}
WEB_URL=${2:-http://localhost:5173}

echo "=== Blog Application Health Check ==="
echo "Checking at: $(date)"
echo

# Check Backend API
echo "Backend API Health Check: $API_URL/api/health"
if response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/health"); then
  if [ "$response" = "200" ]; then
    echo "✅ Backend API: Healthy (HTTP $response)"
  else
    echo "❌ Backend API: Unhealthy (HTTP $response)"
    exit 1
  fi
else
  echo "❌ Backend API: Unreachable"
  exit 1
fi

echo

# Check Frontend
echo "Frontend Health Check: $WEB_URL"
if response=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL"); then
  if [ "$response" = "200" ]; then
    echo "✅ Frontend: Healthy (HTTP $response)"
  else
    echo "⚠️  Frontend: HTTP $response"
  fi
else
  echo "❌ Frontend: Unreachable"
  exit 1
fi

echo
echo "=== All Systems Operational ==="
