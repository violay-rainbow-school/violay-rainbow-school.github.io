(function () {
    const schoolApiUrl = 'http://127.0.0.1:8002';
    const closedDates = [...document.querySelectorAll('.closed-date')].map(
        (closedDateElement) => new Date(closedDateElement.textContent)
    );
    const calendarElements = document.querySelectorAll('.calendar-month');

    /**
     * Extract a child's first name from its element
     */
    const getChildFirstName = (childNameElement) =>
        childNameElement.querySelector('.first-name');

    /**
     * Extract a child's last name from its element
     */
    const getChildLastName = (childNameElement) =>
        childNameElement.querySelector('.last-name');

    /**
     * Update the child select element
     *
     * @param {json} apiResponseContent
     */
    const updateSelectChildElement = (apiResponseContent) => {
        let selectElement = document.getElementById('child-select');
        let children = apiResponseContent['hydra:member'];

        selectElement.innerHTML = '';

        children.map((child) => {
            console.log(child)
            const { id, firstName, lastName } = child;
            selectElement.insertAdjacentHTML(
                'beforeend',
                `<option value="${id}"><span class="first-name">${firstName}</span> <span class="last-name">${lastName}</span></option>`
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
        flashElement.insertAdjacentElement(
            'beforeend',
            `<div>${error.toString()}</div>`
        );
    };

    /**
     * Fetch children then execute the callback
     */
    const fetchChildren = (successCallback, errorCallback = showError) =>
        fetch(`${schoolApiUrl}/api/children`)
            .then((response) => response.json())
            .then((responseContent) => successCallback(responseContent))
            .catch((error) => errorCallback(error));

    // Update child select element
    fetchChildren(updateSelectChildElement);

    /**
     * Update a Child
     *
     * @param {object} child
     * @param {callable} successCallback
     * @param {callable} errorCallback
     */
    const updateChild = (child, successCallback, errorCallback) => {
        fetch(`${schoolApiUrl}/children/${child.id}`, {
            method: 'PUT',
            body: JSON.stringify(child),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => console.log(json))
            .catch((error) => console.error(error));
    };

    // Set the calendar submit action
    document
        .querySelector('#calendar-form')
        .addEventListener('submit', function (event) {
            event.preventDefault();
            const selectedDates = [
                ...document.querySelectorAll('.selected-date'),
            ].map((dateElement) => dateElement.getAttribute('full-date'));
            const childNameElement = document.getElementById('child-select');
            console.log(childNameElement);

            const child = {
                firstName: getChildFirstName(childNameElement),
                lastName: getChildLastName(childNameElement),
                birthday: '2021-01-15T21:37:28.672Z',
                restaurantDays: selectedDates,
            };

            updateChild(child);
        });

    // Create calendars
    calendarElements.forEach((calendarElement) => {
        let monthParts = calendarElement.getAttribute('month').split('-');
        let options = {
            calendarElement,
            closedDates,
            year: monthParts[0],
            month: monthParts[1] - 1,
        };

        createMonthCalendar(options);
    });
})();
