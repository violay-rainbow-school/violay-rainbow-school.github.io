import { getCredentialsFromSession } from '../user-login/user-login.js'

const SCHOOL_API_URL = 'http://127.0.0.1:8002';
const SCHOOL_API_LOGIN_URL = `${SCHOOL_API_URL}/api/please_login`;

/**
 * Log an error
 *
 * @param {object} error
 */
const logError = (error) => console.error(error);

const makeAuthenticationHeaders = () => {
    const credentials = getCredentialsFromSession();
    const myHeaders = new Headers();
    myHeaders.append("x-authentication-username", credentials.username);
    myHeaders.append("x-authentication-password", credentials.password);

    return myHeaders;
};

export async function login(errorCallback = logError) {
    return fetch(`${SCHOOL_API_LOGIN_URL}`, {
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

export async function getChild(childId, errorCallback = logError) {
    return fetch(`${SCHOOL_API_URL}/api/children/${childId}`, {
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

/**
 * Update a Child
 *
 * @param {object} child
 * @param {callable} successCallback
 * @param {callable} errorCallback
 */
export function updateChild(child, errorCallback) {
    const headers = makeAuthenticationHeaders();

    headers.append('content-type', 'application/json; charset=UTF-8');

    return fetch(`${SCHOOL_API_URL}/api/children/${child.id}`, {
        method: 'PUT',
        body: JSON.stringify(child),
        headers,
    })
        .then((response) => response.json())
        .catch(errorCallback);
};
