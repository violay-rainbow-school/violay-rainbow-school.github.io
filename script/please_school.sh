#! /bin/bash

readonly SCRIPT_NAME=$(basename $0)
readonly SCRIPT_DIRECTORY=$(dirname $0)

# foreground
readonly FG_BLACK=$(tput setaf 0)
readonly FG_RED=$(tput setaf 1)
readonly FG_GREEN=$(tput setaf 2)
readonly FG_YELLOW=$(tput setaf 3)
readonly FG_BLUE=$(tput setaf 4)
readonly FG_MAGENTA=$(tput setaf 5)
readonly FG_CYAN=$(tput setaf 6)
readonly FG_WHITE=$(tput setaf 7)

# background
readonly BG_BLACK=$(tput setab 0)
readonly BG_RED=$(tput setab 1)
readonly BG_GREEN=$(tput setab 2)
readonly BG_YELLOW=$(tput setab 3)
readonly BG_BLUE=$(tput setab 4)
readonly BG_MAGENTA=$(tput setab 5)
readonly BG_CYAN=$(tput setab 6)
readonly BG_WHITE=$(tput setab 7)

# reset
readonly STYLE_RESET=$(tput sgr0)

readonly POST_DIRECTORY="$SCRIPT_DIRECTORY/../_posts"

_formatDate() {
    echo "$*" | sed -E 's#([0-9]{2})/([0-9]{2})/([0-9]{4})#\3-\2-\1#'
}

createEvents() {
    if [ $# -lt 1 ]
    then
        echo -e "
postDirectory= ${SCRIPT_NAME} ${FUNCNAME[0]} ${FG_YELLOW}fileContainingEvents${STYLE_RESET}
"

        return 1
    fi

    i=0

    local file="$*"

    while read -r line; do
        local startAtDateLocal=$(echo $line | awk '{ print $1 }')
        local startAtDate=$(_formatDate $startAtDateLocal)
        local startAtTime=$(echo $line | awk '{ print $2 }' | tr -d '()')
        local endAtDateLocal=$(echo $line | awk '{ print $3 }')
        local endAtDate=$(_formatDate $endAtDateLocal)
        local endAtTime=$(echo $line | awk '{ print $4 }' | tr -d '()')
        local title=$(printf "$line" | cut -f 3)
        local fileName="$POST_DIRECTORY/$startAtDate-event-$i.md"

        echo "---
layout: post
title: $title
categories:
- Event
start_date: $startAtDateLocal $startAtTime
end_date: $endAtDateLocal $endAtTime
image: ~
---

$title
" > $fileName
        (( ++i ))
    done <$file
}

# Display the source code of this file
howItWorks() {
    if [ $# -lt 1 ]
    then
        less "$0"

        return
    fi

    less --pattern="$@" "$0"
}

# List all functions that do not begin with an underscore _
_listAvailableFunctions() {
    cat $0 | grep -E '^[a-z]+[a-zA-Z0-9_]*\(\) \{$' | sed 's#() {$##' | sort
}

if [ $# -eq 0 ]
then
    _listAvailableFunctions
    exit
fi

"$@"
