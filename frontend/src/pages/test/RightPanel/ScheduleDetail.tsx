import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: "0 !important",
    height: "40px",
    fontWeight: "normal"
  },
});

const ScheduleDetail = ({ schedule }: any) => {
  const { id, subject, instructor, room, weekday, period, time, entrants, capableStudents, type } = schedule;
  const classes = useStyles();

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
              <TableCell className={classes.tableHeader}>ID</TableCell>
              <TableCell className={classes.tableCell}>{id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Subject</TableCell>
              <TableCell className={classes.tableCell}>{subject}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Instructor</TableCell>
              <TableCell className={classes.tableCell}>{instructor}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Room</TableCell>
              <TableCell className={classes.tableCell}>{room}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Weekday</TableCell>
              <TableCell className={classes.tableCell}>{weekday}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Period</TableCell>
              <TableCell className={classes.tableCell}>{period}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Time</TableCell>
              <TableCell className={classes.tableCell}>{time}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Entrants</TableCell>
              <TableCell className={classes.tableCell}>{entrants}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Capable Students</TableCell>
              <TableCell className={classes.tableCell}>{capableStudents.join(', ')}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableHeader}>Type</TableCell>
              <TableCell className={classes.tableCell}>{type}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ScheduleDetail;
