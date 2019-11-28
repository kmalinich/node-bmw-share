#!/usr/bin/env bash

SCRIPT="$(realpath "${0}")"
SCRIPT_PATH="$(dirname "${SCRIPT}")"

API_JS="${SCRIPT_PATH}/lib/api.js"

tty-table \
	--options-align=left   \
	--options-compact=false \
	--options-borderColor=blue \
	< <({
	echo "Method,Command"
	grep -Eo "app\..*.\('.*.'" "${API_JS}" | grep -Ev '\.all\(' | sed -e 's/app\.//g' -e 's/get(/GET,/g' -e 's/post(/POST,/g' -e "s/'//g" | awk -F ',' '{print $2 "," $1}'
})
