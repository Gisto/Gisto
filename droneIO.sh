#!/bin/bash

# Start

# Vars
ENV_VAR_GISTO_VERSION="0.2.6b" # or set with `droneIO.sh --version=0.2.6b`
ENV_VAR_NWJS_VERSION="0.11.6" # or set with `droneIO.sh --nwjs=0.11.6`
ENV_VAR_GISTO_COMMIT_MESSAGE="$(git log --format='#### %B%n[View on GitHub](https://github.com/Gisto/Gisto/commit/%H)%n%n---' --since=1am)"
DATE_NOW=$(date +"%Y%m%d")

start () {
    # Pull/update submodules
    git submodule init
    git submodule update

    # Dependencies
    sudo apt-get install zip unzip nsis rsync ssh-askpass
    npm install --silent

    # Prepare dist folder
    $DRONE_BUILD_DIR/node_modules/gulp/bin/gulp.js version_bump --to=${ENV_VAR_GISTO_VERSION}-${DATE_NOW}
    $DRONE_BUILD_DIR/node_modules/gulp/bin/gulp.js dist

    # Write config.json
    echo "{\"client_id\":\"$ENV_VAR_GISTO_CLIENT_ID\",\"client_secret\":\"$ENV_VAR_GISTO_CLIENT_SECRET\",\"server_token\":\"$ENV_VAR_GISTO_SERVER_TOKEN\"}" >> dist/config.json

    # Build
    ${DRONE_BUILD_DIR}/build/script/nwjs-build.sh --src=${DRONE_BUILD_DIR}/dist --name=gisto --win-icon=${DRONE_BUILD_DIR}/app/icon.ico --osx-icon=${DRONE_BUILD_DIR}/build/resources/osx/gisto.icns --CFBundleIdentifier=com.gistoapp --version=${ENV_VAR_GISTO_VERSION} --nw=${ENV_VAR_NWJS_VERSION} --libudev --build

    # Prepare
    printf "### git commit(s) from: ${DATE_NOW}\n\n---\n\n${ENV_VAR_GISTO_COMMIT_MESSAGE}" >> ${DRONE_BUILD_DIR}/build/script/TMP/output/_h5ai.header.md
    mv ${DRONE_BUILD_DIR}/build/script/TMP/output ${DRONE_BUILD_DIR}/build/script/TMP/${DATE_NOW}
    cd ${DRONE_BUILD_DIR}/build/script/TMP && ln -s ${DATE_NOW} latest

    # Sync to nightly server
    rsync -avc -e ssh ${DRONE_BUILD_DIR}/build/script/TMP/${DATE_NOW} ${DRONE_BUILD_DIR}/build/script/TMP/latest ${ENV_VAR_NIGHTLY_SERVER}:/home/gistoapp/public_html/
}

### CMD Arguments
while true; do
  case $1 in
    --version=* )
        ENV_VAR_GISTO_VERSION="${1#*=}";
        shift
        ;;
    --nwjs=* )
        ENV_VAR_NWJS_VERSION="${1#*=}";
        shift
        ;;
    -- )
        shift;
        break
        ;;
    -* )
        printf 'Hmmm, unknown option: "%s".\n' "${1}";
        exit 0
        ;;
    * )
        start;
        break
        ;;
  esac
done

# DONE :)

