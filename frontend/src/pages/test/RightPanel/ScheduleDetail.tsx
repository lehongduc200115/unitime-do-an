import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
// import { makeStyles } from '@mui/styles';

const classes = {
  tableHeader: {
    paddingTop: '12px',
    paddingBottom: '12px',
    fontWeight: 'bold !important',
    padding: "0 !important",
    paddingLeft: "1rem !important",
    height: "40px",
  },
  tableCell: {
    borderBottom: 'none',
    // whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: "0 !important",
    height: "40px",
    fontWeight: "normal"
  },
};

const ScheduleDetail = ({ schedule }: any) => {
  const { id, subject, instructor, room, weekday, period, time, entrants, capableStudents, type } = schedule;
  // const classes = useStyles();

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
          <TableBody>
            <TableRow>
              <TableCell style={classes.tableHeader}>ID</TableCell>
              <TableCell style={classes.tableCell}>{id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Subject</TableCell>
              <TableCell style={classes.tableCell}>{subject}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Instructor</TableCell>
              <TableCell style={classes.tableCell}>{instructor}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Room</TableCell>
              <TableCell style={classes.tableCell}>{room}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Weekday</TableCell>
              <TableCell style={classes.tableCell}>{weekday}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Period</TableCell>
              <TableCell style={classes.tableCell}>{period}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Time</TableCell>
              <TableCell style={classes.tableCell}>{time}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Entrants</TableCell>
              <TableCell style={classes.tableCell}>{entrants}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Capable Students</TableCell>
              <TableCell style={classes.tableCell}>{capableStudents.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={classes.tableHeader}>Type</TableCell>
              <TableCell style={classes.tableCell}>{type}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScheduleDetail;
