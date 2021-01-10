/**
 * Create a calendar for a month
 *
 * @param {int} year
 * @param {int} month january is 0
 */
function createMonthCalendar(properties) {
    const {
        calendarElement,
        selectedDates,
        closedDates,
        year,
        month,
    } = properties;

    const getLastDayOfMonth = (year, month) => {
        const startingDate = new Date(year, month, 1);

        return new Date(
            startingDate.getFullYear(),
            startingDate.getMonth() + 1,
            0
        );
    };

    const isSchoolOpen = (date) => {
        return !closedDates.includes(date.getDate());
    };

    const lastDayOfMonth = getLastDayOfMonth(year, month);
    const dateCount = lastDayOfMonth.getDate();
    const dates = [];

    for (let i = 0; i < dateCount; i++) {
        dates.push(new Date(year, month, i + 1));
    }

    const firstDayNameIndex = dates[0].getDay();

    // Draw month name
    const getMonthName = (monthIndex) => {
        return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(
            new Date(year, monthIndex, 1)
        );
    }

    calendarElement.insertAdjacentHTML(
        'beforebegin',
        `<div class="month-name">${getMonthName(month)}</div>`
    );

    // Draw day names
    const getDayName = (day) =>
        new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(
            new Date(year, 1, day)
        );

    for (let i = 1; i <= 7; i++) {
        calendarElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day-name">${getDayName(i)}</div>`
        );
    }

    // Draw empty cases from previous month
    const drawEmptyCase = (dayNumber) =>
        calendarElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day-blank"></div>`
        );

    if (firstDayNameIndex === 0) {
        for (let i = 1; i < 7; i++) {
            drawEmptyCase(i);
        }
    } else if (firstDayNameIndex !== 1) {
        for (let i = 1; i < dates[0].getDay(); i++) {
            drawEmptyCase(i);
        }
    }

    // Draw calendar
    dates.map((date) => {
        calendarElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day ${
                isSchoolOpen(date) ? 'school-open' : 'school-closed'
            }">${date.getDate()}</div>`
        );
    });

    // Style calendar
    calendarElement.style.display = 'grid';
    calendarElement.style.gridTemplateColumns = 'repeat(7, 1fr)';

    // Select dates
    document.querySelectorAll('.school-open').forEach((openDay) => {
        openDay.addEventListener('click', function (event) {
            this.classList.toggle('selected');

            const selectedDay = this.textContent;

            if (
                this.classList.contains('selected') &&
                !selectedDates.includes(selectedDay)
            ) {
                selectedDates.push(new Date(year, month, selectedDay));
                console.log(`${selectedDay} added to`, selectedDates);
                return;
            }

            selectedDates = selectedDates.filter(
                (date) => `${date.getDate()}` !== selectedDay
            );

            console.log(`${selectedDay} removed from`, selectedDates);
        });
    });
}
