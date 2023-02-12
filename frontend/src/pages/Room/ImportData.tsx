import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import { useEffect, useState } from 'react';

import { generateRowsInfo } from './util';

function safeStringify(value: any) {
  const seen = new Set()
  return JSON.stringify(value, (k, v) => {
    if (seen.has(v)) { return '...' }
    if (typeof v === 'object') { seen.add(v) }
    return v
  })
}

const MetadataField = () => {
  return (
    <>
      <Grid item xs={12} sm={4}>
        <TextField
          required
          fullWidth
          id="roomCampus"
          name="roomCampus"
          label="Campus"
          placeholder="E.g. Lý Thường Kiệt"
          autoFocus
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <TextField
          required
          fullWidth
          id="roomBlock"
          name="roomBlock"
          label="Block"
          placeholder="E.g. H1"
        />
      </Grid>
      <Grid item xs={6} sm={4}>
        <TextField
          required
          fullWidth
          id="roomNumber"
          name="roomNumber"
          label="Number"
          placeholder="E.g. 101"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          Information
        </Typography>
      </Grid>
      <Grid item xs={7} md={3}>
        <TextField
          required
          fullWidth
          id="roomType"
          name="roomType"
          label="Type"
          placeholder="E.g. Lecture"
        />
      </Grid>
      <Grid item xs={5} md={2}>
        <TextField
          required
          fullWidth
          type="number"
          id="roomCapacity"
          name="roomCapacity"
          label="Capacity"
          placeholder="E.g. 120"
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <TextField
          fullWidth
          id="roomDepartment"
          name="roomDepartment"
          label="Department"
          placeholder="E.g. Khoa học & Kỹ thuật Máy tính"
        />
      </Grid>
    </>
  )
}

export const UtilizedTimetable = () => {
  const rowsInfo = generateRowsInfo();

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell align='center'>Period</TableCell>
            <TableCell align='center'>Time slot</TableCell>
            <TableCell align='center'>Monday</TableCell>
            <TableCell align='center'>Tuesday</TableCell>
            <TableCell align='center'>Wednesday</TableCell>
            <TableCell align='center'>Thursday</TableCell>
            <TableCell align='center'>Friday</TableCell>
            <TableCell align='center'>Saturday</TableCell>
            <TableCell align='center'>Sunday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsInfo.map((row) => {
            return (
              <TableRow
                key={row.period}
              >
                <TableCell align='center'>{row.period}</TableCell>
                <TableCell align='center'>{row.timeSlot}</TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
                <TableCell align='center'><Checkbox /></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


const ImportData = () => {
  const [fileDetail, setFileDetail] = useState(null);
  const [fileTime, setFileTime] = useState(null);
  const [expanded, setExpanded] = useState<string | false>('panel2');
  // const [isUploading, setIsUploading] = useState(false);

  const handleBrowseFile = (event: any, isDetail: boolean = true) => {
    const file = event.target.files[0];
    // console.log(`event.target: ${safeStringify(event.target.files[0].name)}`)
    console.log(`name: ${JSON.stringify(event.target.files[0].name)}`)
    console.log(`file: ${JSON.stringify(event.target.files[0])}`)
    // console.log(`event: ${JSON.stringify(event)}`)
    if (file) {
      const setFile = isDetail ? setFileDetail : setFileTime;
      setFile(file);
    }
  };

  const handleUploadFile = () => {
    console.log(`fileDetail: ${fileDetail}`);
    console.log(`fileTime: ${fileTime}`);
  }

  const handleAccordionExpand = (panel: string) => {
    return (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    }
  }

  return (
    <>
      {/* Add via form */}
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleAccordionExpand('panel1')}
        disableGutters
        elevation={3}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={styles.customAccordion}
        >
          <Typography variant="h6">
            Add manually
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="form">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Location
                </Typography>
              </Grid>
              <MetadataField />
              <Grid item xs={12}>
                <Typography variant="subtitle1">
                  Utilized timetable
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <UtilizedTimetable />
              </Grid>
            </Grid>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* File uploading */}
      <Accordion
        expanded={expanded === 'panel2'}
        onChange={handleAccordionExpand('panel2')}
        disableGutters
        elevation={3}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={styles.customAccordion}
        >
          <Typography variant='h6'>
            Upload file
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box textAlign='center'>
            <Typography variant='body1' sx={styles.textDetail}>
              Upload 1 xlsx file contains all required sheet: Subject, Room, Lecturer, Timetable sheets.
            </Typography>
            <ButtonGroup
              sx={styles.uploadButton}
              variant='contained'
            >
              <Button
                startIcon={<ScreenSearchDesktopIcon />}
                component="label"
              >
                Browse detail 2
                <input
                  type="file"
                  // accept=".csv, .xlsx"
                  onChange={
                    (e) => { handleBrowseFile(e); }
                  }
                // onChange={(e) => { console.log("abc " + e.target.files[0].name) }}
                // hidden
                />
              </Button>
            </ButtonGroup>
            <Container disableGutters maxWidth="xs" sx={styles.textBoxChosenFile}>
              <Typography variant='body1' sx={[styles.textDetail, styles.textChosenFile]}>
                <Typography component='span'>
                  {'Chosen file detail: '}
                </Typography>
                {fileDetail?.name}
              </Typography>
              <Typography variant='body1' sx={[styles.textDetail, styles.textChosenFile]}>
                <Typography component='span'>
                  {'Uploaded at: '}
                </Typography>
                {fileTime?.name}
              </Typography>
            </Container>
            <Button
              sx={styles.uploadButton}
              startIcon={<UploadFileIcon />}
              variant='contained'
              // disabled={!fileDetail || !fileTime}
              onClick={handleUploadFile}
            >
              Upload
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  )
}

const styles = {
  customAccordion: {
    '&:before': {
      display: 'none',
    },
    '&.Mui-expanded': {
      borderBottom: '1px solid #dddddd'
    }
  },
  textDetail: {
    mb: 2,
  },
  textChosenFile: {
    textAlign: 'left',
    my: 1,
  },
  textBoxChosenFile: {
    px: 12,
    mb: 2,
  },
  uploadButton: {
    alignSelf: 'center',
    mb: 1,
  }
}

export default ImportData;