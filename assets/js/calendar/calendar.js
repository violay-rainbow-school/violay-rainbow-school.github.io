/**
 * Create a calendar for a month
 *
 * @param {int} year
 * @param {int} month january is 0
 */
function createMonthCalendar(properties) {
    const {
        calendarElement,
        closedDates,
        year,
        month,
        selectedDates,
    } = properties;

    const getLastDayOfMonth = (year, month) => {
        const startingDate = new Date(year, month, 1);

        return new Date(
            startingDate.getFullYear(),
            startingDate.getMonth() + 1,
            0
        );
    };

    const isSelectedDate = (date) => selectedDates.includes(date);

    const isSchoolOpen = (date) =>
        closedDates.filter((closedDate) => {
            closedDate.setHours(0, 0, 0, 0);
            return date.toString() === closedDate.toString();
        }).length <= 0;

    const lastDayOfMonth = getLastDayOfMonth(year, month);
    const dateCount = lastDayOfMonth.getDate();
    const dates = [];

    for (let i = 0; i < dateCount; i++) {
        dates.push(new Date(year, month, i + 1));
    }

    const firstDayNameIndex = dates[0].getDay();

    // Clear calendar element
    console.log(calendarElement.innerHTML)
    calendarElement.innerHTML = '';

    // Draw month name in calendar title
    const getMonthName = (monthIndex) => {
        return new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(
            new Date(year, monthIndex, 1)
        );
    };

    const titleElement = document.createElement('div');
    titleElement.innerHTML = `<div class="month-name">${getMonthName(
        month
    )} ${year}</div>`;
    calendarElement.appendChild(titleElement);

    const calendarDatesElement = document.createElement('div');
    calendarDatesElement.classList.add('calendar-month');
    calendarElement.appendChild(calendarDatesElement);

    // Draw day names
    const getDayName = (day) =>
        new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(
            new Date(2018, 0, day)
        );

    for (let i = 1; i <= 7; i++) {
        calendarDatesElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day-name">${getDayName(i)}</div>`
        );
    }

    // Draw empty cases from previous month
    const drawEmptyCase = (dayNumber) =>
        calendarDatesElement.insertAdjacentHTML(
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
        console.log({ selectedDates, isSelectedDate: isSelectedDate(date) }); // WIP
        calendarDatesElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day ${
                isSchoolOpen(date) ? 'school-open' : 'school-closed'
            }" full-date="${year}-${
                month + 1
            }-${date.getDate()}">${date.getDate()}</div>`
        );
    });

    // Select dates
    calendarDatesElement.querySelectorAll('.school-open').forEach((openDay) => {
        openDay.addEventListener('click', function (event) {
            this.classList.toggle('selected-date');
        });
    });
}
