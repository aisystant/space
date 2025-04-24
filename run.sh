#!/bin/bash

docker run --rm \
  --env-file .env \
  --name noco \
  -v "$(pwd)"/nocodb:/usr/app/data/ \
  -p 8080:8080 \
  nocodb-local
