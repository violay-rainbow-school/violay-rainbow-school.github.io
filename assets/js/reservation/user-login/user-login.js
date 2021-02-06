import { Event } from '../event/Event.js';

export const loginEvent = new Event();
export const loginFailureEvent = new Event();
export const logoutEvent = new Event();

/**
 * Session storage keys
 */
const SESSION_KEY_LOGIN_USERNAME = 'login-username';
const SESSION_KEY_LOGIN_PASSWORD = 'login-password';

const loginFormElement = document.getElementById('login-form');
const logoutButtonElement = document.getElementById('logout-button');

// Save credentials on login
loginEvent.addListener(() => saveCredentialsFromDomToSession());

// Logout
logoutButtonElement.addEventListener('click', function (event) {
    logoutEvent.fire();
});

// Submit login form
loginFormElement.addEventListener('submit', function (event) {
    event.preventDefault();
    loginEvent.fire();
});

export const saveCredentialsFromDomToSession = () => {
    return saveCredentialsToSession(getCredentialsFromDom());
};

export const saveCredentialsToSession = ({ username, password }) => {
    if (!username || !password) {
        loginFailureEvent.fire();

        return STOP_PROPAGATION;
    }

    sessionStorage.setItem(SESSION_KEY_LOGIN_USERNAME, username);
    sessionStorage.setItem(SESSION_KEY_LOGIN_PASSWORD, password);
};

export const removeCredentialsFromSession = () => {
    sessionStorage.removeItem(SESSION_KEY_LOGIN_USERNAME);
    sessionStorage.removeItem(SESSION_KEY_LOGIN_PASSWORD);
};

export const getCredentialsFromDom = () => {
    return {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    };
};

export const getCredentialsFromSession = () => {
    return {
        username: sessionStorage.getItem(SESSION_KEY_LOGIN_USERNAME),
        password: sessionStorage.getItem(SESSION_KEY_LOGIN_PASSWORD),
    };
};
