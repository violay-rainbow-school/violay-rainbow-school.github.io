import { getCredentialsFromSession } from '../user-login/user-login.js';
import { SCHOOL_API_URL, SCHOOL_API_LOGIN_URL } from './school-api-config.js';

const logError = (error) => console.error(error);

//
// Authentication
//

const makeAuthenticationHeaders = () => {
    const credentials = getCredentialsFromSession();
    const myHeaders = new Headers();
    myHeaders.append('x-authentication-username', credentials.username);
    myHeaders.append('x-authentication-password', credentials.password);

    return myHeaders;
};

export async function login(errorCallback = logError) {
    return fetch(`${SCHOOL_API_LOGIN_URL}`, {
        method: 'GET',
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => {
            if (response.status != 200) {
                throw Error(`API response status code: ${response.status}`);
            }
            return response.json();
        })
        .catch(errorCallback);
}

//
// Child
//

export async function getChild(childId, errorCallback = logError) {
    return fetch(`${SCHOOL_API_URL}/children/${childId}`, {
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

export function updateChildTopicDays(child, errorCallback) {
    const headers = makeAuthenticationHeaders();

    headers.append('content-type', 'application/json; charset=UTF-8');

    return fetch(`${SCHOOL_API_URL}/children/${child.id}/topic_days`, {
        method: 'PUT',
        body: JSON.stringify(child),
        headers,
    })
        .then((response) => response.json())
        .catch(errorCallback);
}
