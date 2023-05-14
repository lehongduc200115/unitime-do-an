import React, { useState } from 'react';
import "./styles.css"
import constants from "./constants"
import { timeRangeParser } from "./utils";
import _ from 'lodash';

const timeSlots = [
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

// const defaultTimetable = [
// { weekday: '2', time: '13:00-16:00', subject: 'Math', instructor: 'John', type: 'lec', entrants: 30 },
// { weekday: '2', time: '9:00-12:00', subject: 'Science', instructor: 'Jane', type: 'lab', entrants: 20 },
// { weekday: '2', time: '15:00-17:00', subject: 'History', instructor: 'Mike', type: 'lec', entrants: 35 },
// { weekday: '3', time: '12:00-14:00', subject: 'English', instructor: 'Amy', type: 'lab', entrants: 25 },
// { weekday: '3', time: '15:00-17:00', subject: 'Physics', instructor: 'David', type: 'lec', entrants: 40 },
// ];


interface TimetableCellProps {
  id: string,
  subject: string,
  instructor: string,
  room: string,
  weekday: string,
  period: string,
  time: string,
  entrants: number,
  capableStudents: string[],
  type: "not_available" | "origin" | "new" | "modified" | "new_modified";
}

export const hue = {
  not_available: "",
  origin: "#f2f2f2", // light-gray
  new: "#c3e6cb", //green
  modified: "#ffb347", // orange pastel
  new_modified: "#ffd1dc" // pink pastel
}
// interface IEngineOutputClass {
// }

interface TimetableRowProps {
  day: string;
  events: TimetableCellProps[];
}

const TimetableCell = ({ capableStudents, subject, instructor, type, entrants }: TimetableCellProps) => {
  const color = hue[type]

  const [showCapableStudents, setShowCapableStudents] = useState(false);

  return (
    <td style={{
      fontWeight: "bold",
      backgroundColor: color,
      borderRadius: "5px"
    }}>
      {subject && (
        <div className="timetable-subject">{subject}</div>
      )}
      {instructor && (
        <div className="timetable-instructor">{instructor}</div>
      )}
      {entrants && (
        <div className="timetable-entrants">{entrants ? `Size: ${entrants}` : ""}</div>
      )}
      {capableStudents && capableStudents.length > 0 && (
        <>
          <button onClick={() => setShowCapableStudents(!showCapableStudents)}>
            {showCapableStudents ? "Hide" : "Show"}
          </button>
          {showCapableStudents && (
            <div className="capable-students-dropdown">
              <ul>
                {capableStudents.map((student, index) => (
                  <li key={index}>{student}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </td>
  );
};

const TimetableRow = ({ day, events }: TimetableRowProps) => {
  const eventMap: { [time: string]: TimetableCellProps } = {};

  events.forEach(cell => {
    eventMap[cell.time] = cell
  });

  console.log(`events: ${JSON.stringify(eventMap)}`)

  return (
    <tr>
      <th>{day}</th>
      {timeSlots.map((timeSlot, i) => (
        <TimetableCell
          key={i}
          time={timeSlot}
          {...(eventMap[timeSlot] || {} as TimetableCellProps)}
        />
      ))}
    </tr>
  );
};

const TimetableView = (props: { timetableProps?: TimetableCellProps[] }) => {
  const { timetableProps } = props
  // const [currentTime, setCurrentTime] = useState(new Date());
  const [timetable, setTimetable] = useState<TimetableCellProps[]>([]);
  // const [parsedTimetable, setParsedTimetable] = useState(defaultTimetable);

  React.useEffect(() => {
    if (timetableProps && timetableProps.length !== 0)
      setTimetable(timetableProps)
  }, [timetableProps])

  const parsedTimetable = (timetable).flatMap((it) => {
    return timeRangeParser(it.time).map(time => {
      const cloned = _.clone(it);
      if (cloned) cloned.time = time;
      return cloned;
    })
  })

  console.log(`timetable: ${JSON.stringify(timetable)}`)
  console.log(`parsedTimetable: ${JSON.stringify(parsedTimetable)}`)

  return (
    <div>

      <table className="timetable">
        <thead>
          <tr>
            <th></th>
            {timeSlots.map(it => {
              return (
                <th>{it}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {
            parsedTimetable.length !== 0 ?
              (constants.WEEK_DAYS.map((weekday, i) => {
                if (weekday === "") return;

                const day = parsedTimetable.filter(d => {
                  console.log(`found: ${JSON.stringify(d)}`)
                  return d.weekday === i.toString()
                }) || [];

                console.log(`day: ${JSON.stringify(day)}`)
                return (
                  <TimetableRow key={i} day={weekday} events={day} />
                );
              })) : ""
          }
        </tbody>
      </table>
    </div>
  );
};

export default TimetableView;
