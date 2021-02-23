export const formatDateAsNumber = (dateToFormat) =>
    dateToFormat.getFullYear() +
    `${dateToFormat.getMonth()}`.padStart(2, '0') +
    `${dateToFormat.getDate()}`.padStart(2, '0');
