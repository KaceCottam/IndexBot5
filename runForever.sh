#!/usr/bin/bash
# please use `npm start` instead!
if ! [[ -f config.json ]]; then
    cp -v default_config.json config.json
    echo "Please set up the config.json"
    exit 1
fi
ROLES_DB=$(jq -r .ROLES_DB config.json)
while true; do node .; done
