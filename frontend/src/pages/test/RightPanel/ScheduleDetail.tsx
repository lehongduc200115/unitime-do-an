import React, { useState } from 'react';
import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';


import './styles.css';

const ScheduleDetail = ({ schedule }: any) => {
  const { id, subject, instructor, room, weekday, period, time, entrants, capableStudents, type } = schedule;
  const [isStudentExpanded, setIsStudentExpaned] = useState(false);

  return (
    <>
      <Typography variant="h6" gutterBottom style={{
        paddingTop: "1rem",
        paddingLeft: "1rem",
      }}>
        {`Subject #${id}`}
      </Typography>
      <TableContainer>
        <Table style={{ border: 'none' }}>
          <TableHead>
            <TableRow>
              <TableCell className='table-header'>Property</TableCell>
              <TableCell className='table-header' style={{
                paddingLeft: "0px !important",
              }}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className='table-header'>ID</TableCell>
              <TableCell className='table-cell'>
                <EditableBox enableEdit={false}>{id}</EditableBox>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Subject</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{subject}</EditableBox>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Instructor</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{instructor}</EditableBox></TableCell>

            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Room</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{room}</EditableBox></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Weekday</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{weekday}</EditableBox></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Period</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{period}</EditableBox></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Time</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{time}</EditableBox></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Entrants</TableCell>
              <TableCell className='table-cell'>
                <EditableBox>{entrants}</EditableBox></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Capable Students</TableCell>
              <TableCell className='table-cell'>
                <EditableBox onClick={() => setIsStudentExpaned((cur) => !cur)}>
                  {!isStudentExpanded ? `${capableStudents.length} students` : capableStudents.join(', ')}
                </EditableBox>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='table-header'>Type</TableCell>
              <TableCell className='table-cell'>
                <EditableBox enableEdit={false}>{type}</EditableBox>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const EditableBox = ({ children, onClick, enableEdit = true }: any) => {
  return (
    <Box
      borderRadius={2}
      p={2}
      // bgcolor="#f5f5f5"
      height={40}
      sx={{
        padding: "8px !important",
        '&:hover': enableEdit && {
          border: "1px solid",
          borderColor: "primary.main",
          cursor: "pointer",
          opacity: [0.9, 0.8, 0.7],
        },
      }}
      onClick={onClick}>
      {children}
    </Box>)
}

export default ScheduleDetail;
