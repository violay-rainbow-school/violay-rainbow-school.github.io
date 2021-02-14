import { getCredentialsFromSession } from '../user-login/user-login.js';
import { SCHOOL_API_URL, SCHOOL_API_LOGIN_URL } from './school-api-config.js';

/**
 * Log an error
 *
 * @param {object} error
 */
const logError = (error) => console.error(error);

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
// TopicDay
//

export async function listChildTopicDays(childId, errorCallback = logError) {
    return fetch(`${SCHOOL_API_URL}/topic_days?child=${childId}`, {
        method: 'GET',
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

export async function createTopicDay(topicDay, errorCallback = logError) {
    const headers = makeAuthenticationHeaders();

    headers.append('content-type', 'application/json; charset=UTF-8');

    return fetch(`${SCHOOL_API_URL}/topic_days`, {
        method: 'POST',
        headers: makeAuthenticationHeaders(),
        body: JSON.stringify(topicDay),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

export async function deleteTopicDay(topicDayId, errorCallback = logError) {
    return fetch(`${SCHOOL_API_URL}/topic_days/${topicDayId}`, {
        method: 'DELETE',
        headers: makeAuthenticationHeaders(),
    })
        .then((response) => response.json())
        .catch(errorCallback);
}

//
// Child
//

export function makeChildIri(childId) {
    return `/children/${childId}`;
}

export async function getChild(childId, errorCallback = logError) {
    return fetch(`${SCHOOL_API_URL}/children/${childId}`, {
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

    return fetch(`${SCHOOL_API_URL}/children/${child.id}`, {
        method: 'PUT',
        body: JSON.stringify(child),
        headers,
    })
        .then((response) => response.json())
        .catch(errorCallback);
}
