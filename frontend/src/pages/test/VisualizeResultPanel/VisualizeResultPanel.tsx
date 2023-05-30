import * as React from "react";
import { FlexCol } from "src/components/FlexCol/FlexCol";
import TimetableView from "../Timetable/Timetable";

import { hue } from "../Timetable/Timetable"
import { BKTab, BKTable } from "@components";
import _ from "lodash";
import { SolutionTable } from "./SolutionTable";
import { Button, ButtonGroup, Grid } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from "@mui/system/Box";

interface IEngineOutputClass {
  id: string;
  subject: string;
  instructor: string;
  room: string;
  weekday: string;
  period: string;
  time: string;
  entrants: number;
  capableStudents: string[];
  type: "not_available" | "origin" | "new" | "modified" | "new_modified";
}


type Timetable = IEngineOutputClass[]


export const VisualizeResultPanel = (
  props: {
    status: "success" | "fail",
    data: {
      result: Timetable[]
    }
  }
) => {
  console.log("vaoday")
  console.log(`data from VisualizeResultPanel: ${JSON.stringify(props.data.result)}`)
  const [data, setData] = React.useState<any>(props.data.result);
  const [viewData, setViewData] = React.useState<any>({});
  const [mode, setMode] = React.useState<"table" | "room" | "lecturer">("table")
  // const [roomAssociated, setRoomAssociated] = React.useState<string>(null)
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };



  React.useEffect(() => {
    setData(props.data.result);
  }, [props.data]);

  return (
    <FlexCol>
      <BKTab tabLabels={_.range(data.length).map((it) => `Solution ${it + 1}`)}>
        {
          data ? data.map((timetable: Timetable) => {
            return timetable ?
              (
                <FlexCol>
                  {/* <Button onClick={() => exportToExcel(timetable, 'timetable')}>Export Timetable</Button> */}
                  <Grid container>
                    <Grid xs={6}>
                      <span style={{ marginRight: "10px" }}>Group by:</span>
                      <ButtonGroup variant="outlined" aria-label="outlined button group">
                        <Button variant={mode === 'room' ? "contained" : "outlined"} onClick={() => setMode("room")}>Room</Button>
                        <Button variant={mode === 'lecturer' ? "contained" : "outlined"} onClick={() => setMode("lecturer")}>Lecturer</Button>
                        <Button variant={mode === 'table' ? "contained" : "outlined"} onClick={() => setMode("table")}>Table</Button>
                      </ButtonGroup>
                    </Grid>
                    <Grid>
                      <span style={{ marginRight: "10px" }}>Filter by:</span>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Age</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                          >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <div className="legend">

                    {Object.keys(hue).map((status) => (
                      <div style={{
                        backgroundColor: hue[status as keyof typeof hue]
                      }}>{status}</div>
                    ))}
                  </div>
                  {(mode === 'room' || mode === 'lecturer') && <TimetableView
                    timetableProps={timetable as any}
                  />}
                  <SolutionTable
                    columns={Object.keys(timetable[0])}
                    data={timetable}
                    setData={() => { }}
                    setViewData={() => setViewData}
                  />
                </FlexCol>
              )
              : ""
          }) : ""
        }
      </BKTab >
    </FlexCol >
  )
}