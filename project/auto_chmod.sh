#!/bin/bash

WATCH_DIR="."

inotifywait -m -r -e create "$WATCH_DIR" --format '%w%f' | while read NEWFILE
do
    chmod 777 "$NEWFILE"
    echo "Set 777 permissions for $NEWFILE"
done
