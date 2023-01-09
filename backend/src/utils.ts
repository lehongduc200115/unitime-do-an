/* 
1. get subject permutation
2. get eligible class, eligible lec
3. utils: timetable or timetable, tb and tb; class or class -> append to List, class or lec -> create a tuple
4. foreach cell:
  4.05 result += cell.
  4.1 foreach per of tuple, result += info continue #2
*/

// 1. get subject permutations
const permutator = (subjectIds: string[]) => {
  let result: string[][] = [];

  const permute = (arr: string[], m: string[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(subjectIds);

  return result;
};

// const parseDailyTimetableWithIds = (
//   tbl: IDailyTimetable[]
// ): IDailyTimetableWithIds[] => {
//   return tbl.map((day) => {
//     return day.map((hour) => (hour ? (Array(0) as string) : hour));
//   });
// };

// const timetableManipulation = (
//   method: String,
//   tbl1: IDailyTimetableWithIds[],
//   _tbl2: IDailyTimetableWithIds[]
// ) => {
//   const array11False = Array.apply(null, Array(11)).map((_it) => false);
//   const result: IDailyTimetable[] = Array.apply(null, Array(5)).map((_it) =>
//     JSON.parse(JSON.stringify(array11False))
//   );
//   if (method == "AND") {
//     tbl1.forEach((dailyTime, _dayIdx) => {
//       dailyTime.map(_hour, _hourIdx) => {
//         // result[dayIdx][hourIdx] = hour && tbl2[dayIdx][hourIdx];
//       });
//     });
//   } else if (method == "OR") {
//     tbl1.forEach((dailyTime, dayIdx) => {
//       dailyTime.map((hour, hourIdx) => {
//         // result[dayIdx][hourIdx] = hour || tbl2[dayIdx][hourIdx];
//       });
//     });
//   }

//   return result;
// };

const performGaTimetable = (
  classTTble: IDailyTimetable[],
  roomTTble: IDailyTimetable[],
  lecturerTTbl: IDailyTimetable[]
): IDailyTimetable[] => {
  // perform Ga
  return [
    [true, true, false],
    [false, false],
  ];
};
