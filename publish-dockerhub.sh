#!/bin/bash 

# Build

# bash ./build-local-docker-image.sh

# Don't forget about the docker login

# docker login -u aisystant
# use PAT instead of password


VERSION=$(git describe --tags --abbrev=0)

# Tag the image aisystant/space:latest, aisystant/space:$VERSION
docker tag nocodb-local:latest aisystant/space:$VERSION
docker tag nocodb-local:latest aisystant/space:latest

# Publish nocodb-local:latest docker image to dockerhub as aisystant/space
docker push aisystant/space:latest
docker push aisystant/space:$VERSION
