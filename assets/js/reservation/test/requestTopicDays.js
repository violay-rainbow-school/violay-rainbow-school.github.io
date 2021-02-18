const initialSelectedDaysJson =
    '[{"id":1,"child":"/api/children/1","topic":"caterer","day":"2021-04-16T00:00:00+00:00"},{"id":2,"child":"/api/children/1","topic":"caterer","day":"2021-04-06T00:00:00+00:00"},{"id":3,"child":"/api/children/1","topic":"caterer","day":"2021-02-19T00:00:00+00:00"},{"id":4,"child":"/api/children/1","topic":"nursery","day":"2021-03-02T00:00:00+00:00"},{"id":5,"child":"/api/children/1","topic":"nursery","day":"2021-01-14T00:00:00+00:00"},{"id":6,"child":"/api/children/1","topic":"nursery","day":"2021-04-13T00:00:00+00:00"}]';
const catererSelectedDaysJson =
    '[{"child":"/children/1","topic":"caterer","day":"2021-02-01T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-02-02T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-02-08T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-02-09T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-04-06T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-04-23T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-05-06T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-05-10T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-05-13T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-05-14T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-05-20T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-01T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-03T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-04T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-07T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-08T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-10T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-11T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-14T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-15T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-17T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-18T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-21T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-22T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-24T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-25T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-28T00:00:00.000Z"},{"child":"/children/1","topic":"caterer","day":"2021-06-29T00:00:00.000Z"}]';
const nurserySelectedDaysJson =
    '[{"child":"/children/1","topic":"nursery","day":"2021-03-02T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-05T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-09T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-12T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-16T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-19T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-23T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-26T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-03-30T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-01T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-08T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-09T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-15T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-16T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-22T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-23T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-04-29T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-06-08T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-06-14T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-06-15T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-06-22T00:00:00.000Z"},{"child":"/children/1","topic":"nursery","day":"2021-06-28T00:00:00.000Z"}]';

const initialSelectedDays = JSON.parse(initialSelectedDaysJson);
const catererSelectedDays = JSON.parse(catererSelectedDaysJson);
const nurserySelectedDays = JSON.parse(nurserySelectedDaysJson);

function addDaysToDate(date, daysCount) {
    const resultDate = new Date();

    resultDate.setFullYear(date.getFullYear());
    resultDate.setMonth(date.getMonth());
    resultDate.setDate(date.getDate() + daysCount);

    return resultDate;
}

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

function createRequest() {
    return initialSelectedDays.map((initialDay) => {

    });
}

console.log(createRequest());
