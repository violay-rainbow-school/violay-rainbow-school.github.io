import { createMonthCalendar } from './calendar/calendar.js';
import {
    loginEvent,
    loginFailureEvent,
    logoutEvent,
} from './user-login/user-login.js';
import {
    login,
    getChild,
    updateChild
} from './school-api/school-api.js';

(function () {
    const selectChildElementId = 'child-select';
    const selectChildElement = document.getElementById(selectChildElementId);
    const closedDates = [...document.querySelectorAll('.closed-date')].map(
        (element) => new Date(element.textContent)
    );
    const openDates = [...document.querySelectorAll('.open-date')].map(
        (element) => new Date(element.textContent)
    );
    const openWeekdays = [
        ...document.querySelectorAll('.open-weekday'),
    ].map((element) => Number(element.textContent));
    let currentChild = {};
    const calendarElements = document.querySelectorAll('div[month]');

    /**
     * Refresh child select element options
     *
     * @param {json} apiResponseContent
     */
    const refreshSelectChildElement = () => {
        login().then((user) => {
            selectChildElement.innerHTML = '<option value="">...</option>';
            user.children.map((child) => {
                const { id, firstName, lastName } = child;
                selectChildElement.insertAdjacentHTML(
                    'beforeend',
                    `<option value="${id}" full-name="${firstName}%${lastName}">${firstName} ${lastName}</option>`
                );
            });
        });
    };

    loginEvent.addListener(refreshSelectChildElement);
    logoutEvent.addListener(function (event) {
        calendarElements.forEach(
            (calendarElement) => (calendarElements.innerHTML = '')
        );
        this.classList.add('hidden');
        loginFormElement.classList.remove('hidden');
    });

    /**
     * Get the current child on change
     */
    selectChildElement.addEventListener('change', function (event) {
        if (!this.value) {
            showError('Select a child please.');

            return;
        }

        getChild(this.value, showError).then((child) => {
            currentChild = child;
            createCalendars();
        });
    });

    /**
     * Show an error in the flash message element
     *
     * @param {object} error
     */
    const showError = (error) => {
        console.error(error);
        let flashElement = document.getElementById('flash');

        flashElement.innerHTML = '';
        flashElement.insertAdjacentHTML(
            'beforeend',
            `<div class="alert-danger">${
                error instanceof Object ? error.toString() : error
            }</div>`
        );
    };

    // Set the calendar submit action
    document
        .querySelector('#calendar-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const selectedDates = [
                ...document.querySelectorAll('.selected-date'),
            ].map((dateElement) => {
                return { date: dateElement.getAttribute('full-date') };
            });
            const childNameElement =
                selectChildElement.options[selectChildElement.selectedIndex];
            const childFullNameParts = childNameElement
                .getAttribute('full-name')
                .split('%');

            const child = {
                id: childNameElement.value,
                firstName: childFullNameParts[0],
                lastName: childFullNameParts[1],
                birthday: '2021-01-15T21:37:28.672Z',
                restaurantDays: selectedDates,
            };

            updateChild(child);
        });

    /**
     * Create or refresh calendars
     */
    const createCalendars = () => {
        calendarElements.forEach((calendarElement) => {
            let monthParts = calendarElement.getAttribute('month').split('-');
            let options = {
                calendarElement,
                closedDates,
                openDates,
                openWeekdays,
                year: monthParts[0],
                month: monthParts[1] - 1,
                selectedDates:
                    currentChild.restaurantDays.map(
                        (date) => new Date(date.date)
                    ) ?? [],
            };

            calendarElement.innerHTML = '';
            createMonthCalendar(options);
        });
    };
})();