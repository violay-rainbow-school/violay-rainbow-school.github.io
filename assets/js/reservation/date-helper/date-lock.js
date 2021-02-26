export const isLockedDateFromToday = (date, lockingDayCount) => {
    const today = new Date();
    const limitDay = new Date();

    limitDay.setDate(today.getDate() + lockingDayCount);

    if (date <= limitDay) {
        return true;
    }

    return false;
}
