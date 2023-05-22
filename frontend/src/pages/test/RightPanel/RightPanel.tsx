import { Button } from '@mui/material';
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
  const [expanded, setExpanded] = useState(true);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  // const [properties, setProperties] = useState({
  //   name: 'My Component',
  //   color: '#ffffff',
  //   size: 'medium',
  // });

  // const handlePropertyChange = (propertyName: any, newValue: any) => {
  //   setProperties({
  //     ...properties,
  //     [propertyName]: newValue,
  //   });
  // };

  return (
    <div
      style={{
        // position: 'fixed',
        // top: 0,
        // right: 0,
        // right: expanded ? '10px' : '-400px',
        height: '100vh',
        // width: expanded ? "400px" : '10px',
        width: "100%",
        // paddingTop: "64px",
        backgroundColor: '#f1f1f1',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        zIndex: 999, // ensure panel is above other elements
        transition: 'right 0.3s', // Add transition effect
      }}
    >
      <Button
        style={{
          // position: 'absolute',
          // top: '100px',
          // right: '100px',
          padding: '4px',
          borderRadius: '40%',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          marginTop: '4px',
          marginLeft: '4px'
        }}
        sx={{
          "&:hover": {
            backgroundColor: '#fff',
          }
        }}
        onClick={toggleExpand}
      >
        {expanded ? '>>' : '<<'}
      </Button>
      <ScheduleDetail schedule={TEST_DATA
      }></ScheduleDetail>
    </div>
  );
};

export default RightPanel;
