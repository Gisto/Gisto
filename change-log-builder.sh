#!/usr/bin/env bash

COMMITS=$(git log `git describe --tags --abbrev=0`..HEAD --oneline --pretty=format:'*  %s [View](https://github.com/Gisto/Gisto/commit/%H)' --reverse | grep -v Merge)

printf "### vPLACEHOLDER\n${COMMITS}\n\n" | cat - CHANGELOG.md > /tmp/temp-gisto-msg && mv /tmp/temp-gisto-msg CHANGELOG.md

