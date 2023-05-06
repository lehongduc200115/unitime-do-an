import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useState } from "react";

interface IUploader {
  onUpload: (e: any) => void;
}

const Uploader = ({ onUpload }: IUploader) => {
  const [fileDetail, setFileDetail] = useState(null);
  // const [isUploading, setIsUploading] = useState(false);

  const handleBrowseFile = (event: any,) => {
    const file = event.target.files[0];
    // console.log(`event.target: ${safeStringify(event.target.files[0].name)}`)
    console.log(`name: ${JSON.stringify(event.target.files[0].name)}`)
    console.log(`lastModified: ${JSON.stringify(new Date(event.target.files[0].lastModified))}`)
    // console.log(`event: ${JSON.stringify(event)}`)
    if (file) {
      setFileDetail(file);
      onUpload(file);
    }

  };

  return (
    <Box textAlign='center'>
      <Typography variant='body1' sx={styles.textDetail}>
        Upload 1 xlsx file contains all required sheet: Subject, Room, Instructor, Timetable sheets.
      </Typography>
      <ButtonGroup
        sx={styles.uploadButton}
        variant='contained'
      >
        <Button
          startIcon={<ScreenSearchDesktopIcon />}
          component="label"
        >
          browse file
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={
              (e) => { handleBrowseFile(e); }
            }
            hidden
          // onChange={(e) => { console.log("abc " + e.target.files[0].name) }}
          // hidden
          />
        </Button>
      </ButtonGroup>
      {fileDetail && <Container disableGutters maxWidth="xs" sx={styles.textBoxChosenFile}>
        <Typography variant='body1' sx={[styles.textDetail, styles.textChosenFile]}>
          <Typography component='span'>
            {'File: '}
          </Typography>
          {fileDetail?.name}
        </Typography>
        <Typography variant='body1' sx={[styles.textDetail, styles.textChosenFile]}>
          <Typography component='span'>
            {'Last Modified: '}
          </Typography>
          {(new Date(fileDetail?.lastModified)).toString()}
        </Typography>
      </Container>}
      {/* <Button
        sx={styles.uploadButton}
        startIcon={<UploadFileIcon />}
        variant='contained'
        disabled={!fileDetail}
        onClick={onUpload}
      >
        Upload
      </Button> */}
    </Box>
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

export default Uploader;