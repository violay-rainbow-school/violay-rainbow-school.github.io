(function () {
    const schoolApiUrl = 'http://127.0.0.1:8002';
    const selectChildElementId = 'child-select';
    const selectChildElement = document.getElementById(selectChildElementId);
    const closedDates = [...document.querySelectorAll('.closed-date')].map(
        (closedDateElement) => new Date(closedDateElement.textContent)
    );
    const calendarElements = document.querySelectorAll('.calendar-month');

    /**
     * Update the child select element
     *
     * @param {json} apiResponseContent
     */
    const updateSelectChildElement = (apiResponseContent) => {
        let children = apiResponseContent['hydra:member'];

        selectChildElement.innerHTML = '';
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
        flashElement.insertAdjacentElement(
            'beforeend',
            `<div>${error.toString()}</div>`
        );
    };

    /**
     * List children then execute the callback
     */
    const listChildren = (successCallback, errorCallback = showError) =>
        fetch(`${schoolApiUrl}/api/children`)
            .then((response) => response.json())
            .then((responseContent) => successCallback(responseContent))
            .catch((error) => errorCallback(error));

    // Update child select element
    listChildren(updateSelectChildElement);

    /**
     * Update a Child
     *
     * @param {object} child
     * @param {callable} successCallback
     * @param {callable} errorCallback
     */
    const updateChild = (child, successCallback, errorCallback) => {
        fetch(`${schoolApiUrl}/api/children/${child.id}`, {
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

    // TODO: update calendars by highlighting already selected restaurant days of the current child
})();
