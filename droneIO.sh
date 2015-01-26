#!/bin/bash

# Start
ENV_VAR_GISTO_VERSION="0.2.6b"
ENV_VAR_NW_VERSION="0.11.6"
ENV_VAR_GISTO_COMMIT_MESSAGE="$(git log --format='#### %B%n[View on GitHub](https://github.com/Gisto/Gisto/commit/%H)%n%n---' --since=1am)"
DATE_NOW=$(date +"%Y%m%d")

git submodule init
git submodule update

# Dependencies
sudo apt-get install zip unzip nsis rsync ssh-askpass
npm install --silent

# Prepare dist
$DRONE_BUILD_DIR/node_modules/gulp/bin/gulp.js dist

# Write config.json
echo "{\"client_id\":\"$ENV_VAR_GISTO_CLIENT_ID\",\"client_secret\":\"$ENV_VAR_GISTO_CLIENT_SECRET\",\"server_token\":\"$ENV_VAR_GISTO_SERVER_TOKEN\"}" >> dist/config.json

# Build
${DRONE_BUILD_DIR}/build/script/nwjs-build.sh --src=${DRONE_BUILD_DIR}/dist --name=gisto --win-icon=${DRONE_BUILD_DIR}/app/icon.ico --osx-icon=${DRONE_BUILD_DIR}/build/resources/osx/gisto.icns --osx-plist=${DRONE_BUILD_DIR}/build/resources/osx/Info.plist --nw=${ENV_VAR_NW_VERSION} --libudev --build

# Prepare
printf "### git commit(s) from: ${DATE_NOW}\n\n---\n\n${ENV_VAR_GISTO_COMMIT_MESSAGE}" >> ${DRONE_BUILD_DIR}/build/script/TMP/output/_h5ai.header.md
mv ${DRONE_BUILD_DIR}/build/script/TMP/output ${DRONE_BUILD_DIR}/build/script/TMP/${DATE_NOW}
cd ${DRONE_BUILD_DIR}/build/script/TMP && ln -s ${DATE_NOW} latest

# Sync to nightly server
rsync -avc -e ssh ${DRONE_BUILD_DIR}/build/script/TMP/${DATE_NOW} ${DRONE_BUILD_DIR}/build/script/TMP/latest ${ENV_VAR_NIGHTLY_SERVER}:/home/gistoapp/public_html/

# DONE :)

