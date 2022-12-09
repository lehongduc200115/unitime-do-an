"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
const fillWith = (arr, expectedLength, x) => {
    arr.length = expectedLength;
    return Array.from(arr, (v) => (v ? v : x));
};
const mergeDailyTime = (weekTimes) => {
    const result = fillWith(Array(), 6, fillWith(Array(), 10, false));
    weekTimes.map((weekTime) => {
        weekTime.map((dailyTime, dayOfTheWeek) => {
            dailyTime.map((hourTime, timeOfTheDay) => {
                result[dayOfTheWeek][timeOfTheDay] =
                    result[dayOfTheWeek][timeOfTheDay] || hourTime;
            });
        });
    });
    return result;
};
const extractCalendarByCriteria = (_weeklyTimetable, _criteria) => { };
exports.utils = {
    fillWith,
};
//# sourceMappingURL=utils.js.map