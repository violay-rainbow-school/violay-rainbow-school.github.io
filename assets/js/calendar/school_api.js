(function () {
    const schoolApiUrl = 'http://127.0.0.1:8002';
    const closedDates = [...document.querySelectorAll('.closed-date')].map(closedDateElement => new Date(closedDateElement.textContent));
    const calendarElements = document.querySelectorAll('.calendar-month');

    document.querySelector('#calendar-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedDates = [...document.querySelectorAll('.selected-date')].map(dateElement => dateElement.getAttribute('full-date'))
        console.log(selectedDates)
        
        // TODO: replace by a POST request to save dates
        fetch(`${schoolApiUrl}/api/children`)
        .then((response) => response.json())
        .then((responseContent) => console.log(responseContent))
    })
    
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
})()