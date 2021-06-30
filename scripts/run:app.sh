#!/usr/bin/env bash

if [[ -z "${PORT}" ]]; then
	export PORT="3050"
fi

if [[ -z "${API_URL}" ]]; then
	export API_URL="http://localhost:3000"
fi

if [[ -z "${ROOT_DIR}" ]]; then
	export ROOT_DIR="app"
fi

if [[ -z "${NODE_ENV}" ]]; then
	export NODE_ENV="production"
fi

rm -rf ./dist/app; \
NODE_ENV=$NODE_ENV \
PORT=$PORT \
API_URL=$API_URL \
ROOT_DIR=$ROOT_DIR \
node packages/app/server.js;