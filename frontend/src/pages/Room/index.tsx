import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import { 
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import { useState, useEffect } from 'react';


const theme = createTheme();

const Room = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const handleUploadFile = (event: any) => {
    setSelectedFile(event?.target?.files[0]);
    console.log(event);
  }
  

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <Typography
          variant='h4'
          sx={styles.title}
        >
          Import data
        </Typography>
        <Accordion disableGutters elevation={3}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant='h6'>
              Add manually
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              Room
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion disableGutters elevation={3}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography variant='h6'>
              Upload file
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box textAlign='center'>
              <Typography variant='body1' sx={styles.textDetail}>
                Search for data file on your computer. Supported CSV files only.
              </Typography>
              <Button
                sx={styles.uploadButton}
                startIcon={<ScreenSearchDesktopIcon/>}
                variant='contained'
                component="label"
              >
                Browse
                <input
                  type="file"
                  accept='.csv'
                  onChange={handleUploadFile}
                  hidden
                />
              </Button>
              <Typography variant='body1' sx={styles.textDetail}>
                Chosen file: {selectedFile?.name}
              </Typography>
              <Button
                sx={styles.uploadButton}
                startIcon={<UploadFileIcon/>}
                variant='contained'
                disabled={!selectedFile}
              >
                Upload
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Typography
          variant='h4'
          sx={styles.title}
        >
          Review
        </Typography>
      </Container>
    </ThemeProvider>
  )
}

const styles = {
  title: {
    mt: 3,
    mb: 1.5,
  },
  textDetail: {
    mb: 2,
  },
  uploadButton: {
    alignSelf: 'center',
    mb: 3,
  }
}

export default Room;