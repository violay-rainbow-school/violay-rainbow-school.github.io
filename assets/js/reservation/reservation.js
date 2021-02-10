import { createMonthCalendar } from './calendar/calendar.js';
import {
    loginEvent,
    loginFailureEvent,
    logoutEvent,
} from './user-login/user-login.js';
import { login, getChild, updateChild } from './school-api/school-api.js';

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

    loginEvent.addListener(() =>
        [...document.getElementsByClassName('calendar-child')].map(
            (element) => (element.style.display = 'block')
        )
    );
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
            [...document.getElementsByClassName('calendar')].map(
                (element) => (element.style = 'block')
            );
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

    /**
     * Get selected dates of a topic
     */
    const getSelectedDatesFromDom = (topic) => {
        const dates = [
            ...document.querySelectorAll(`[topic=${topic}] .selected-date`),
        ].map((dateElement) => {
            return {
                date: dateElement.getAttribute('full-date'),
            };
        });
        console.log(dates);

        return dates;
    };

    // Set the calendar submit action
    document
        .querySelector('#reservation-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const restaurantDays = getSelectedDatesFromDom('restaurant');
            const nurseryDays = getSelectedDatesFromDom('nursery');
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
                restaurantDays,
                nurseryDays,
            };

            updateChild(child);
        });

    /**
     * Create or refresh calendars
     */
    const createCalendars = () => {
        calendarElements.forEach((calendarElement) => {
            let monthParts = calendarElement.getAttribute('month').split('-');
            const topic = calendarElement.getAttribute('topic');
            let selectedDates = [];

            if (topic === 'restaurant') {
                selectedDates = currentChild.restaurantDays.map(
                    (date) => new Date(date.date)
                );
            } else if (topic === 'nursery') {
                selectedDates = currentChild.nurseryDays.map(
                    (date) => new Date(date.date)
                );
            }

            let options = {
                calendarElement,
                closedDates,
                openDates,
                openWeekdays,
                year: monthParts[0],
                month: monthParts[1] - 1,
                selectedDates,
            };

            calendarElement.innerHTML = '';
            createMonthCalendar(options);
        });
    };
})();
