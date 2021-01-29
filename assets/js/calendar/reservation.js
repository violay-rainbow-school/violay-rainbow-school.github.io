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
    let children = [];
    let currentChild = {};
    const calendarElements = document.querySelectorAll('div[month]');
    let accessToken = '';
    const loginFormElement = document.getElementById('login-form');
    const disconnectButtonElement = document.getElementById('disconnect-button');

    // Logout
    disconnectButtonElement.addEventListener('click', function (event) {
        accessToken = '';
        this.classList.add('hidden');
        loginFormElement.classList.remove('hidden')
    });

    /**
     * Handle login form
     */
    loginFormElement.addEventListener('submit', function (event) {
        event.preventDefault();
        email = document.getElementById('parent-email').value;
        password = document.getElementById('parent-password').value;
        fetchTokenPromise(email, password).then((response) => {
            accessToken = response;
            loginFormElement.classList.add('hidden');
            disconnectButtonElement.classList.remove('hidden');
        });
    });

    /**
     * Get the current child on change
     */
    selectChildElement.addEventListener('change', function (event) {
        if (!this.value) {
            showError('Select a child please.');
            return;
        }

        getChild(
            this.value,
            (child) => {
                currentChild = child;
                createCalendars();
            },
            showError
        );
    });

    /**
     * Refresh child select element options
     *
     * @param {json} apiResponseContent
     */
    const refreshSelectChildElement = (apiResponseContent) => {
        children = apiResponseContent['hydra:member'];

        selectChildElement.innerHTML = '<option value="">...</option>';
        children.map((child) => {
            const { id, firstName, lastName } = child;
            selectChildElement.insertAdjacentHTML(
                'beforeend',
                `<option value="${id}" full-name="${firstName}%${lastName}">${firstName} ${lastName}</option>`
            );
        });
    };

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

    // Update child select element
    listChildren(refreshSelectChildElement);

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
