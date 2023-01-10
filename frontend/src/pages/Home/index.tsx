import {
  Container,
  Typography,
} from '@mui/material/';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

import Review from './Review';
import ImportData from './ImportData';


const theme = createTheme();

const Unitime = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <Typography
          variant='h4'
          sx={styles.title}
        >
          Unitime - Timetabling tool
        </Typography>
        <Typography
          variant='h5'
          sx={styles.heading}
        >
          Import data
        </Typography>
        <ImportData />
      </Container>
    </ThemeProvider>
  )
}

const styles = {
  title: {
    mt: 3,
    textAlign: 'center'
  },
  heading: {
    mt: 3,
    mb: 1.5,
  }
}

export default Unitime;