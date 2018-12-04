#!/usr/bin/env bash
if ss -lnt | grep -q :$SERVER_PORT; then
  echo "Another process is already listening to port $SERVER_PORT"
  exit 1;
fi
RETRY_INTERVAL=${RETRY_INTERVAL:-0.2}

yarn run test:serve &
until ss -lnt | grep -q :$SERVER_PORT; do
  sleep $RETRY_INTERVAL
done
npx cucumber-js spec/cucumber/features --require-module @babel/register --require spec/cucumber/steps
kill -15 0