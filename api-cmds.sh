#!/usr/bin/env bash

grep -Eo "app\..*.\('.*.'" api.js | grep -Ev '\.all\(' | sed -e 's/app\.//g' -e 's/get(/GET\ \ /g' -e 's/post(/POST\ /g'
