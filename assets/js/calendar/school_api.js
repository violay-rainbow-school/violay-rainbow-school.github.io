const schoolApiUrl = 'http://127.0.0.1:8002';

/**
 * Log an error
 *
 * @param {object} error
 */
const logError = (error) => console.error(error);

async function fetchTokenPromise(username, password) {
    const response = await fetch(`${schoolApiUrl}/api/login_check`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    return response.json();
}

/**
 * Login
 */
const login = (username, password, successCallback, errorCallback = logError) =>
    fetch(`${schoolApiUrl}/api/login_check`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
        .then((response) => response.json())
        .then((responseContent) => successCallback(responseContent))
        .catch((error) => errorCallback(error));

/**
 * List children then execute the callback
 *
 * @param {callable} successCallback
 * @param {callable} errorCallback
 */
const listChildren = (successCallback, errorCallback = logError) =>
    fetch(`${schoolApiUrl}/api/children`)
        .then((response) => response.json())
        .then((responseContent) => successCallback(responseContent))
        .catch((error) => errorCallback(error));

const getChild = (childId, successCallback, errorCallback = logError) =>
    fetch(`${schoolApiUrl}/api/children/${childId}`)
        .then((response) => response.json())
        .then((responseContent) => successCallback(responseContent))
        .catch((error) => errorCallback(error));

/**
 * Update a Child
 *
 * @param {object} child
 * @param {callable} successCallback
 * @param {callable} errorCallback
 */
const updateChild = (child, successCallback, errorCallback) => {
    fetch(`${schoolApiUrl}/api/children/${child.id}`, {
        method: 'PUT',
        body: JSON.stringify(child),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
        .then((response) => response.json())
        .then((responseContent) => successCallback(responseContent))
        .catch((error) => errorCallback(error));
};
