import { Event } from '../event/Event.js';
import { login } from '../school-api/school-api.js';

export const loginEvent = new Event();
export const loginSuccessEvent = new Event();
export const loginFailureEvent = new Event();
export const logoutEvent = new Event();

// Session storage keys
const SESSION_KEY_LOGIN_USERNAME = 'login-username';
const SESSION_KEY_LOGIN_PASSWORD = 'login-password';

// DOM elements
const loginFormElement = document.getElementById('login-form');
const logoutButtonElement = document.getElementById('logout-button');

// Submit login form
loginFormElement.addEventListener('submit', function (event) {
    event.preventDefault();
    loginEvent.fire();
});

// Login
loginEvent.addListener(() => {
    login((error) => {
        loginFailureEvent.fire(error);
    }).then((user) => {
        if (user && user.id) {
            console.log('Fire loginSuccessEvent with user', user);
            loginSuccessEvent.fire(user);
        }
    });
});

// Save credentials on login
loginSuccessEvent.addListener(() => saveCredentialsFromDomToSession());

// Hide login form and display logout button
loginSuccessEvent.addListener(() => {
    loginFormElement.classList.add('hidden');
    logoutButtonElement.classList.remove('hidden');
});

// Logout
logoutButtonElement.addEventListener('click', function (event) {
    logoutEvent.fire();
});

// Hide logout button and display login form
logoutEvent.addListener(() => {
    loginFormElement.classList.remove('hidden');
    logoutButtonElement.classList.add('hidden');
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
