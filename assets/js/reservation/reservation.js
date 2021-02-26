import { createCalendar } from './calendar/calendar.js';
import {
    loginEvent,
    loginFailureEvent,
    loginSuccessEvent,
    logoutEvent,
} from './user-login/user-login.js';
import { getChild, updateChildTopicDays } from './school-api/school-api.js';
import { TopicDay } from './school-api/TopicDay.js';
import { Child } from './school-api/Child.js';
import { isLockedDateFromToday } from './date-helper/date-lock.js'
import { LOCKING_DAYS_COUNT } from './calendar/calendar-config.js'

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
    const calendarElements = document.querySelectorAll('.calendar');
    const lastSchoolDate = new Date(
        document.body.querySelector('#last-school-date').textContent
    );

    //
    // Flash message
    //

    const showError = (error) => {
        console.error(error);
        let flashElement = document.getElementById('flash');

        flashElement.insertAdjacentHTML(
            'beforeend',
            `<div class="alert-danger">${
                error instanceof Object ? error.toString() : error
            }</div>`
        );
    };

    const showWarning = (error) => {
        console.error(error);
        let flashElement = document.getElementById('flash');

        flashElement.insertAdjacentHTML(
            'beforeend',
            `<div class="alert-warning">${
                error instanceof Object ? error.toString() : error
            }</div>`
        );
    };

    const showSuccess = (message) => {
        let flashElement = document.getElementById('flash');

        flashElement.insertAdjacentHTML(
            'beforeend',
            `<div class="alert-success">${message}</div>`
        );
    };

    const clearFlashMessages = () => {
        document.getElementById('flash').innerHTML = '';
    };

    /**
     * Refresh child select element options
     *
     * @param {json} apiResponseContent
     */
    const refreshSelectChildElement = (user) => {
        selectChildElement.innerHTML = '<option value="">...</option>';
        user.children.map((child) => {
            const { id, firstName, lastName } = child;
            selectChildElement.insertAdjacentHTML(
                'beforeend',
                `<option value="${id}" full-name="${firstName}%${lastName}">${firstName} ${lastName}</option>`
            );
        });
    };

    // On successful login:
    // Display child selection
    loginSuccessEvent.addListener(() =>
        [...document.getElementsByClassName('calendar-child')].map(
            (element) => (element.style.display = 'block')
        )
    );
    // Refresh child selection
    loginSuccessEvent.addListener(refreshSelectChildElement);
    // Display a flash message
    loginSuccessEvent.addListener((user) => {
        showSuccess(
            `Vous êtes connecté en tant que ${user.firstName} ${user.lastName}, vous pouvez choisir votre enfant.`
        );
    });

    // On failed login:
    // Display flash message
    loginFailureEvent.addListener(() => {
        showError('Veuillez utiliser vos identifiants transparent classroom');
    });

    // On logout:
    // Remove calendars
    logoutEvent.addListener(() => {
        calendarElements.forEach(
            (calendarElement) => (calendarElement.innerHTML = '')
        );
        hideCalendars();
    });

    const showCalendars = () =>
        [
            ...document.getElementsByClassName('calendar-wrapper'),
        ].map((element) => element.classList.remove('hidden'));

    const hideCalendars = () =>
        [
            ...document.getElementsByClassName('calendar-wrapper'),
        ].map((element) => element.classList.add('hidden'));

    //
    // Create calendars on child select
    //

    selectChildElement.addEventListener('change', function (event) {
        const childId = this.value;

        if (!childId) {
            showError('Select a child please.');

            return;
        }

        getChild(childId, showError).then((response) => {
            currentChild = response;
            createCalendars(currentChild.topicDays);
            showCalendars();
        });
    });

    const getSelectedTopicDaysFromDom = (topic = undefined) => {
        const dates = [...document.querySelectorAll('.selected-date')].map(
            (dateElement) => {
                // No topic specified, get all dates
                if (!topic) {
                    return createTopicDayFromDomElement(dateElement);
                }

                // A topic is specified, filter on topic
                if (dateElement.getAttribute('topic') === topic) {
                    return createTopicDayFromDomElement(dateElement);
                }
            }
        );

        return dates;
    };

    const createTopicDayFromDomElement = (element) => {
        const topic = element.closest('[topic]').getAttribute('topic');
        const rawDate = element.getAttribute('full-date');

        return new TopicDay(null, currentChild.id, topic, new Date(rawDate));
    };

    const getSelectedChildIdFromDom = () =>
        selectChildElement.options[selectChildElement.selectedIndex].value;

    //
    // Save on calendar form submit
    //

    document
        .querySelector('#reservation-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();
            const child = new Child(
                currentChild.id,
                currentChild.firstName,
                currentChild.lastName,
                getSelectedTopicDaysFromDom()
            );
            updateChildTopicDays(child).then((response) => {
                currentChild = response.child;

                // Fix serialization as object
                if (!Array.isArray(currentChild.topicDays)) {
                    currentChild.topicDays = Object.values(currentChild.topicDays);
                }

                createCalendars(currentChild.topicDays);
                clearFlashMessages();

                if (response.addedTopicDaysCount) {
                    showSuccess(
                        `${response.addedTopicDaysCount} jour(s) ajouté(s).`
                    );
                }

                if (response.removedTopicDaysCount) {
                    showSuccess(
                        `${response.removedTopicDaysCount} jour(s) retiré(s).`
                    );
                }

                if (response.invalidTopicDaysCount) {
                    showWarning(
                        `${response.invalidTopicDaysCount} jour(s) invalides.`
                    );
                }
            });
        });

    /**
     * Create or refresh calendars
     */
    const createCalendars = (topicDays) => {
        const nurserySelectedDays = [];
        const catererSelectedDates = [];

        topicDays.forEach((topicDay) => {
            if (isLockedDateFromToday(new Date(topicDay.day), LOCKING_DAYS_COUNT)) {
                return;
            }

            if (topicDay.topic === 'caterer') {
                catererSelectedDates.push(new Date(topicDay.day));
                return;
            }

            if (topicDay.topic === 'nursery') {
                nurserySelectedDays.push(new Date(topicDay.day));
            }
        });

        calendarElements.forEach((calendarElement) => {
            const topic = calendarElement.getAttribute('topic');
            let selectedDates = [];

            if (topic === 'caterer') {
                selectedDates = catererSelectedDates;
            } else if (topic === 'nursery') {
                selectedDates = nurserySelectedDays;
            }

            let options = {
                calendarElement,
                topic,
                firstDate: new Date(),
                lastDate: lastSchoolDate,
                closedDates,
                openDates,
                openWeekdays,
                selectedDates,
            };

            calendarElement.innerHTML = '';
            createCalendar(options);
        });
    };
})();
