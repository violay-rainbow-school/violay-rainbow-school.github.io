import { formatDateAsNumber } from '../date-helper/date-format.js'

const getNextMonth = (date) => {
    const nextMonth = new Date(date.getFullYear(), 1, 1);

    nextMonth.setMonth(date.getMonth() + 1);

    return nextMonth;
};

const concatenateYearMonth = (date) => {
    return `${date.getFullYear()}` + `${date.getMonth()}`.padStart(2, 0);
};

const getMonthInterval = (firstDate, lastDate) => {
    let currentMonth = firstDate;
    let nextMonth = undefined;
    const months = [currentMonth];

    do {
        nextMonth = getNextMonth(currentMonth);
        months.push(nextMonth);
        currentMonth = nextMonth;
    } while (
        concatenateYearMonth(currentMonth) < concatenateYearMonth(lastDate)
    );

    return months;
};

const createMonthCalendarElement = (topic) => {
    const monthCalendarElement = document.createElement('div');

    monthCalendarElement.classList.add('calendar');
    monthCalendarElement.setAttribute('topic', topic);

    return monthCalendarElement;
}

/**
 * Create a calendar from a topic and an array of CalendarMonth
 */
export const createCalendar = (properties) => {
    const {
        calendarElement,
        topic,
        firstDate,
        lastDate,
        closedDates,
        openDates,
        openWeekdays,
        selectedDates,
    } = properties;
    const months = getMonthInterval(firstDate, lastDate);

    months.forEach((month) => {
        const monthCalendarElement = createMonthCalendarElement(topic);

        calendarElement.appendChild(monthCalendarElement);
        createMonthCalendar({
            monthCalendarElement,
            closedDates,
            openDates,
            openWeekdays,
            year: month.getFullYear(),
            month: month.getMonth(),
            selectedDates,
        });
    });
}

/**
 * Create a calendar for a month
 *
 * @param {int} year
 * @param {int} month january is 0
 */
const createMonthCalendar = (properties) => {
    const {
        monthCalendarElement,
        closedDates,
        openDates,
        openWeekdays,
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

    const isSelectedDate = (date) => {
        const formatDateAsNumber = (dateToFormat) =>
            dateToFormat.getFullYear() + `${dateToFormat.getMonth()}`.padStart(2, '0') + `${dateToFormat.getDate()}`.padStart(2, '0');

        return (
            selectedDates.filter(
                (currentDate) =>
                    formatDateAsNumber(date) === formatDateAsNumber(currentDate)
            ).length > 0
        );
    };

    /**
     * Check if school is open on a specific date
     *
     * @param {Date} date
     */
    const isSchoolOpen = (date) => {
        const datesIncludes = (dates, date) => {
            return (
                dates.filter(
                    (currentDate) =>
                        formatDateAsNumber(date) ===
                        formatDateAsNumber(currentDate)
                ).length > 0
            );
        };

        const isWeekdayOpen = openWeekdays.includes(date.getDay());
        const isOpenDate = datesIncludes(openDates, date);
        const isClosedDate = datesIncludes(closedDates, date);

        return (isWeekdayOpen || isOpenDate) && !isClosedDate;
    };

    const lastDayOfMonth = getLastDayOfMonth(year, month);
    const dateCount = lastDayOfMonth.getDate();
    const dates = [];

    for (let i = 0; i < dateCount; i++) {
        dates.push(new Date(year, month, i + 1));
    }

    const firstDayNameIndex = dates[0].getDay();

    // Clear calendar element
    monthCalendarElement.innerHTML = '';

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
    monthCalendarElement.appendChild(titleElement);

    const calendarDatesElement = document.createElement('div');
    calendarDatesElement.classList.add('calendar-month');
    monthCalendarElement.appendChild(calendarDatesElement);

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
        calendarDatesElement.insertAdjacentHTML(
            'beforeend',
            `<div class="day ${
                isSchoolOpen(date) ? 'school-open' : 'school-closed'
            } ${
                isSelectedDate(date) ? 'selected-date' : ''
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
