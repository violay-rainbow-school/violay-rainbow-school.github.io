#! /bin/bash

## Helper to communicate with transparent classroom API

API_URL='https://www.transparentclassroom.com/api/v1'

help() {
    echo -e "Usage:\n    $(basename $0) userEmail userPassword action"
    echo -e "\nWith action:\n    listClassrooms\n    listChildren\n    listForms" 
}

login() {
    local email="$1"
    local password="$2"
    curl -u $email:$password https://www.transparentclassroom.com/api/v1/authenticate.json
}

getTokenFromLoginResponse() {
    regex="\"api_token\":\"([a-zA-Z0-9_\-\!\?]+)\""
    [[ "$1" =~ $regex ]]
    token="${BASH_REMATCH[1]}"
    echo $token
}

request() {
    local token="$1"
    local uri="$2"
    curl -H "X-TransparentClassroomToken: $token" \
        "${API_URL}${uri}"
}

listClassrooms() {
    request "$token" "/classrooms.json"
}

listChildren() {
    request "$token" "/children.json"
}

listForms() {
    request "$token" "/forms.json"
}

if [ ! $# -eq 3 ]; then
    help
    exit
fi

echo zog
exit
loginResponse=$(login "$1" "$2") # Sample: {"type":"user","id":190212,"first_name":"Sarah","last_name":"FRAICHIT","email":"sarah@fraichit.zog","roles":["parent"],"school_id":2760,"api_token":"a62hxP2TtXRDpaBqZ_fs","push_tokens":[],"push_enabled":false}
token=$(getTokenFromLoginResponse $loginResponse)
$3
# listClassrooms
# listChildren
# listForms