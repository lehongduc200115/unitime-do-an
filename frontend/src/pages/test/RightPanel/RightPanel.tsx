import React, { useState } from 'react';
import ScheduleDetail from "./ScheduleDetail"

const TEST_DATA = {
  "id": "1",
  "subject": "1 - GT1",
  "instructor": "1 - GT1",
  "room": "1",
  "weekday": "2",
  "period": "2 - 4",
  "time": "7:00 - 10:00",
  "entrants": 4,
  "capableStudents": ["1 - C.O.A.", "2 - C.O.B.", "6 - E.E.G.", "7 - E.E.H."],
  "type": "origin"
}

const RightPanel = () => {
  const [properties, setProperties] = useState({
    name: 'My Component',
    color: '#ffffff',
    size: 'medium',
  });

  // const handlePropertyChange = (propertyName: any, newValue: any) => {
  //   setProperties({
  //     ...properties,
  //     [propertyName]: newValue,
  //   });
  // };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '400px',
        paddingTop: "64px",
        backgroundColor: '#f1f1f1',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        zIndex: 999, // ensure panel is above other elements
      }}
    >
      <ScheduleDetail schedule={TEST_DATA
      }></ScheduleDetail>
    </div>
  );
};

export default RightPanel;
