import { Grid, InputLabel, Select, SelectChangeEvent, TextField } from "@mui/material";
import { UtilizedTimetable } from "./ImportData";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Typography,
    FormHelperText,
    FormControl,
    MenuItem
} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ScreenSearchDesktopIcon from '@mui/icons-material/ScreenSearchDesktop';
import * as React from 'react'


const MetadataField = () => {
    const [id, setId] = React.useState(null)
    const handleChange = (event: SelectChangeEvent) => {
        setId(event.target.value);
    };

    return (
        <>
            <Grid item xs={12}>
                <Typography variant="subtitle1">
                    Get result by Id
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
                {/* <TextField
                    required
                    fullWidth
                    id="roomCampus"
                    name="roomCampus"
                    label="Campus"
                    placeholder="E.g. Lý Thường Kiệt"
                    autoFocus
                /> */}
                <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="demo-simple-select-helper-label">Id *</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={id}
                        label="Id"
                        onChange={handleChange}
                    >
                        <MenuItem value={10}>101B1</MenuItem>
                        <MenuItem value={20}>102B1</MenuItem>
                        <MenuItem value={30}>102B1</MenuItem>
                    </Select>
                    <FormHelperText>With label + helper text</FormHelperText>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="subtitle1">
                    Location
                </Typography>
            </Grid>
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

const Review = () => {
    const [expanded, setExpanded] = React.useState<string | false>('panel2');
    const handleAccordionExpand = (panel: string) => {
        return (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        }
    }

    return (
        // <Grid>

        // </Grid>
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
                    Search By Id
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Box component="form">
                    <Grid container spacing={2}>
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

export default Review;