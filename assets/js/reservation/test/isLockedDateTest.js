function assertEquals(expected, actual, message = undefined) {
    if (message) {
        console.log(message);
    }

    if (expected !== actual) {
        console.error(`failed: ${actual} is not ${expected}`);
        return;
    }
    console.log('ok');
}

function addDaysToDate(date, daysCount) {
    const resultDate = new Date();

    resultDate.setFullYear(date.getFullYear());
    resultDate.setMonth(date.getMonth());
    resultDate.setDate(date.getDate() + daysCount);

    return resultDate;
}

function isLockedDateFromToday(date, lockingDayCount) {
    const today = new Date();
    const limitDay = new Date();

    limitDay.setDate(today.getDate() + lockingDayCount);

    if (date <= limitDay) {
        return true;
    }

    return false;
}

function testIsLockedDateFromToday() {
    const lockingDayCount = 2;
    const dateWhichShouldBeLocked = new Date('2020-01-01');

    console.log(
        'testIsLockedDateFromToday with lockingDayCount ' + lockingDayCount
    );
    assertEquals(
        true,
        isLockedDateFromToday(dateWhichShouldBeLocked, lockingDayCount),
        'past date should be locked'
    );

    const dateUnlocked = new Date();
    assertEquals(
        true,
        isLockedDateFromToday(dateUnlocked, lockingDayCount),
        'today should be locked'
    );

    const today = new Date();
    assertEquals(
        true,
        isLockedDateFromToday(addDaysToDate(today, 2), lockingDayCount),
        'today + 2 should be locked'
    );
    assertEquals(
        false,
        isLockedDateFromToday(addDaysToDate(today, 3), lockingDayCount),
        'today + 3 should be unlocked'
    );
}

testIsLockedDateFromToday();
