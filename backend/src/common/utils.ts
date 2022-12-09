const fillWith = (arr: Array<any>, expectedLength: number, x: any): any[] => {
  arr.length = expectedLength;
  return Array.from(arr, (v) => (v ? v : x));
};

const mergeDailyTime = (weekTimes: [[IDailyTimetable]]): IDailyTimetable[] => {
  const result: IDailyTimetable[] = fillWith(
    Array(),
    6,
    fillWith(Array(), 10, false)
  );
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

const extractCalendarByCriteria = (
  weeklyTimetable: IDailyTimetable[],
  criteria: ICriteria
) => {};

export const utils = {
  fillWith,
};
