/**
 * Create the calendar
 *
 * @param {int} year
 * @param {int} month january is 0
 */
function createCalendar(properties) {
    const { calendarElement, selectedDates, closedDates, year, month } = properties;

    const getLastDayOfMonth = (year, month) => {
        const startingDate = new Date(year, month, 1);

        return new Date(
            startingDate.getFullYear(),
            startingDate.getMonth() + 1,
            0
        );
    };

    const isWeekend = (date) => {
        let day = date.getDay();
        return day === 0 || day === 6;
    };
    const isSchoolOpen = (date) => {
        return !closedDates.includes(date.getDate()) && !isWeekend(date);
    };

    const lastDayOfMonth = getLastDayOfMonth(year, month);
    const dateCount = lastDayOfMonth.getDate();
    const dates = [];

    for (let i = 0; i < dateCount; i++) {
        dates.push(new Date(year, month, i + 1));
    }

    const firstDayNameIndex = dates[0].getDay();

    // Draw day names
    const getDayName = (day) =>
        new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(
            new Date(2021, 1, day)
        );

    for (let i = 1; i <= 7; i++) {
        calendarElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day ${
                [6, 7].includes(i) ? 'weekend' : ''
            }">${getDayName(i)}</div>`
        );
    }

    // Draw empty cases from previous month
    const drawEmptyCase = (dayNumber) =>
        calendarElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day ${
                [0, 6].includes(dayNumber) ? 'weekend' : ''
            }"></div>`
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
            `<div class="day ${isWeekend(date) ? 'weekend' : ''} ${
                isSchoolOpen(date) ? 'school-open' : ''
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
