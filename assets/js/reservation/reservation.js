import { createCalendar } from './calendar/calendar.js';
import {
    loginEvent,
    loginFailureEvent,
    loginSuccessEvent,
    logoutEvent,
} from './user-login/user-login.js';
import {
    login,
    getChild,
    updateChild,
    createTopicDay,
    listChildTopicDays,
    makeChildIri,
} from './school-api/school-api.js';
import {
    saveTopicDaysToSession,
    getInitialTopicDaysFromSession,
} from './reservation-storage/reservation-storage.js';
import {
    TopicDay
} from './school-api/TopicDay.js'

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

    /**
     * Show an error in the flash message element
     *
     * @param {object} error
     */
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

    const showSuccess = (message) => {
        let flashElement = document.getElementById('flash');

        flashElement.insertAdjacentHTML(
            'beforeend',
            `<div class="alert-success">${message}</div>`
        );
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

    /**
     * Create calendars on child select
     */
    selectChildElement.addEventListener('change', function (event) {
        const childId = this.value;

        if (!childId) {
            showError('Select a child please.');

            return;
        }

        currentChild = {
            id: childId,
            iri: makeChildIri(childId),
        };

        listChildTopicDays(this.value, showError).then((response) => {
            const topicDays = response['hydra:member'].map((responseMember) => new TopicDay(responseMember.id, responseMember.child, responseMember.topic, responseMember.day));

            saveTopicDaysToSession(topicDays);
            createCalendars(topicDays);
            showCalendars();
        });
    });

    /**
     * Get selected dates of a topic
     */
    const getSelectedDatesByTopicFromDom = (topic) => {
        const dates = [
            ...document.querySelectorAll(`[topic=${topic}] .selected-date`),
        ].map((dateElement) => {
            return new Date(dateElement.getAttribute('full-date'));
        });

        return dates;
    };

    const getSelectedChildIdFromDom = () =>
        selectChildElement.options[selectChildElement.selectedIndex].value;

    // Set the calendar submit action
    document
        .querySelector('#reservation-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();

            const catererSelectedDays = getSelectedDatesByTopicFromDom('caterer').map(
                (date) => {
                    return {
                        day: date,
                        topic: 'caterer',
                        child: currentChild.iri,
                    };
                }
            );
            const nurserySelectedDays = getSelectedDatesByTopicFromDom('nursery').map(
                (date) => {
                    return {
                        day: date,
                        topic: 'nursery',
                        child: currentChild.iri,
                    };
                }
            );

            // TODO:
            // 1. compare selectedDates with initialSelectedDates
            // 2. send POST and DELETE topicDay requests accordingly
            const initialTopicDays = getInitialTopicDaysFromSession();
            console.log({catererSelectedDays, initialTopicDays});
            const requests = initialTopicDays.map((initialTopicDay) => {
                const initialSelectedDate = new Date(initialTopicDay.day);

                // catererSelectedDays.map((catererSelectedDay) => {
                //     if (initialSelectedDate.get)
                // })
            });

            // catererDays.forEach((date) =>
            //     createTopicDay({
            //         child: '/api/children/' + childId,
            //         date,
            //         topic: 'caterer',
            //     })
            // );

            // nurseryDays.forEach((date) =>
            //     createTopicDay({
            //         child: '/api/children/' + childId,
            //         date,
            //         topic: 'nursery',
            //     })
            // );
        });

    /**
     * Create or refresh calendars
     */
    const createCalendars = (topicDays) => {
        const nurserySelectedDays = [];
        const catererSelectedDates = [];

        topicDays.forEach((topicDay) => {
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
