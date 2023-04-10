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

const defaultTimetable = [{
  day: '2',
  events: [
    { time: '13:00-16:00', subject: 'Math', instructor: 'John', classType: 'lec', entrants: 30 },
    { time: '9:00-12:00', subject: 'Science', instructor: 'Jane', classType: 'lab', entrants: 20 },
    { time: '15:00-17:00', subject: 'History', instructor: 'Mike', classType: 'lec', entrants: 35 },
  ],
},
{
  day: '3',
  events: [
    { time: '12:00-14:00', subject: 'English', instructor: 'Amy', classType: 'lab', entrants: 25 },
    { time: '15:00-17:00', subject: 'Physics', instructor: 'David', classType: 'lec', entrants: 40 },
  ],
},
];


interface TimetableCellProps {
  time: string;
  subject?: string;
  instructor?: string;
  classType?: string;
  entrants?: number;
}

interface TimetableRowProps {
  day: string;
  events: TimetableCellProps[];
}

const TimetableCell = ({ time, subject, instructor, classType, entrants }: TimetableCellProps) => {
  const cellClass = classType ?
    (classType === 'lec' ? 'lec-cell' : 'lab-cell')
    : 'timetable-cell'
    ;

  return (
    <td className={cellClass}>
      {/* <div>{time}</div> */}
      <div>{subject}</div>
      <div>{instructor}</div>
      <div>{entrants ? `Size: ${entrants}` : ""}</div>
    </td>
  );
};

const TimetableRow = ({ day, events }: TimetableRowProps) => {
  const eventMap: { [time: string]: TimetableCellProps } = {};
  events.forEach(event => {
    eventMap[event.time] = event;
  });

  console.log(`events: ${JSON.stringify(eventMap)}`)

  return (
    <tr>
      <th>{day}</th>
      {timeSlots.map((timeSlot, i) => (
        <TimetableCell
          key={i}
          time={timeSlot}
          {...(eventMap[timeSlot] || {})}
        />
      ))}
    </tr>
  );
};

const TimetableView = (props: { timetableProps?: TimetableRowProps[] }) => {
  const { timetableProps } = props
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timetable, setTimetable] = useState<TimetableRowProps[]>(defaultTimetable);
  // const [parsedTimetable, setParsedTimetable] = useState(defaultTimetable);

  React.useEffect(() => {
    if (timetableProps && timetableProps.length !== 0)
      setTimetable(timetableProps)
  }, [timetableProps])

  const parsedTimetable = (timetable || defaultTimetable).map((it) => {
    const temp = it.events.flatMap(event => {
      return timeRangeParser(event.time).map(time => {
        const cloned = _.clone(event);
        if (cloned) cloned.time = time;
        return cloned;
      })
    })

    it.events = JSON.parse(JSON.stringify(temp))

    return it;
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
                const day = parsedTimetable.find(d => {
                  console.log(`found: ${JSON.stringify(d)}`)
                  return d.day === i.toString()
                }) || { day: weekday, events: [] };

                console.log(`day: ${JSON.stringify(day)}`)
                day.day = weekday
                // const day = timetable.find(d => constants.WEEK_DAYS[parseInt(d.day)]) || { day: weekday, events: [] };
                return (
                  <TimetableRow key={i} day={day.day} events={day.events} />
                );
              })) : ""
          }
        </tbody>
      </table>
      <div className="legend">
        <div className="lec">Lecture</div>
        <div className="lab">Lab</div>
      </div>
    </div>
  );
};

export default TimetableView;
