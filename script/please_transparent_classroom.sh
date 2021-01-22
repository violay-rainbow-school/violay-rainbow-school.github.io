#! /bin/bash

API_URL='https://www.transparentclassroom.com/api/v1'
SCRIPT_NAME=$(basename $0)

login() {
    if [ $# -lt 2 ]; then
        echo -e "${SCRIPT_NAME} ${FUNCNAME[0]} \e[33memailHere passwordHere\e[0m"
        exit 1
    fi

    local email="$1"
    local password="$2"
    curl -u $email:$password ${API_URL}/authenticate.json
}

getTokenFromLoginResponse() {
    if [ $# -eq 0 ]; then
        echo -e "${SCRIPT_NAME} ${FUNCNAME[0]} \e[33mloginResponseHere\e[0m"
        exit 1
    fi

    regex="\"api_token\":\"([a-zA-Z0-9_\-\!\?]+)\""
    [[ "$1" =~ $regex ]]
    token="${BASH_REMATCH[1]}"
    echo $token
}

# Send a request to the API
request() {
    if [ $# -lt 3 ]; then
        echo -e "${SCRIPT_NAME} ${FUNCNAME[0]} \e[33memailHere passwordHere uriHere\e[0m

List of URIs:
    /classrooms.json
    /children.json
    /forms.json
"
        exit 1
    fi

    local loginResponse=$(login "$1" "$2") # Sample: {"type":"user","id":190212,"first_name":"Sarah","last_name":"FRAICHIT","email":"sarah@fraichit.zog","roles":["parent"],"school_id":2760,"api_token":"a62hxP2TtXRDpaBqZ_fs","push_tokens":[],"push_enabled":false}
    local token=$(getTokenFromLoginResponse $loginResponse)
    local uri="$3"

    curl -H "X-TransparentClassroomToken: $token" \
        "${API_URL}${uri}"
}

# Display the source code of this file
howItWorks() {
    cat $0
}

# List all functions that do not begin with an underscore _
_listAvailableFunctions() {
    cat $0 | grep -E '^[a-z]+[a-zA-Z0-9]*\(\) \{$' | sed 's#() {$##'
}

if [ $# -eq 0 ]; then
    _listAvailableFunctions
    exit
fi

$@
