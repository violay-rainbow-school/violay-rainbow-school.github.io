/**
 * Postman pre-request script to fetch transparent classroom API token
 * 
 * https://www.postman.com/
 */

// Fill your email and password
const email = "";
const password = "";

// Encode email:password using base64
const base64Credentials = btoa(`${email}:${password}`);

// Send request to fetch API token
pm.sendRequest({
    url: pm.collectionVariables.get("transparent classroom url") + "/authenticate.json",
    method: 'GET',
    header: {
        'Accept': 'application/json',
        'Authorization': `Basic ${base64Credentials}`
    },
}, function (err, res) {
    console.log(res.json());
    pm.collectionVariables.set("transparent classroom token", res.json().api_token);
});
