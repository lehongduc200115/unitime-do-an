// import constants from "src/helpers/constants"

// export const dateLookUp = (day: string) => {
//   return 
// }
import _ from 'lodash';

export const timeRangeParser = (time: string): string[] => {
  const [startTime, endTime] = time.split("-");

  if (!startTime || !endTime) {
    console.log(`vao day roi: ${time}`);
    return []
  }

  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);

  const timeRange = _.range(startHour, endHour)
  // console.log(`debugging: ${JSON.stringify(timeRange.map(it => it.toString() + ":00"))}`)
  return timeRange.map(it => it.toString() + ":00")
}

// export default {
//   timeRangeParser
// }