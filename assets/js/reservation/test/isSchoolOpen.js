const closedDates = [
    new Date('2021-01-23'),
    new Date('2021-01-21'),
    new Date('2021-01-03'),
    new Date('2021-01-25'),
    new Date('2021-01-26'),
];
const openDates = [
    new Date('2021-01-23'),
    new Date('2021-01-21'),
    new Date('2021-01-03'),
    new Date('2021-01-24'),
    new Date('2021-01-26'),
];
const openWeekdays = [1, 2, 4, 5];

const isSchoolOpen = (date) => {

    const datesIncludes = (dates, date) => {
        const formatDateAsNumber = (dateToFormat) => `${dateToFormat.getFullYear()}${dateToFormat.getMonth()}${dateToFormat.getDate()}`;
        return dates.filter(currentDate => formatDateAsNumber(date) === formatDateAsNumber(currentDate)).length > 0;
    };

    const isWeekdayOpen = openWeekdays.includes(date.getDay());
    const isOpenDate = datesIncludes(openDates, date);
    const isClosedDate = datesIncludes(closedDates, date);
    const result = (isWeekdayOpen || isOpenDate) && !isClosedDate;

    console.log({date, isWeekdayOpen, isOpenDate, isClosedDate, result})

    return result;
};

const testDates = [
    new Date('2021-01-22'), // Open
    new Date('2021-01-23'), // Closed
    new Date('2021-01-24'), // Open
    new Date('2021-01-25'), // Closed
    new Date('2021-01-26'), // Closed
];

function isSchoolOpenTest(dates) {
    dates.forEach((date) => isSchoolOpen(date));
}

isSchoolOpenTest(testDates);