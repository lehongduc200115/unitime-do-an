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
  const [mode, setMode] = React.useState<"id" | "room" | "instructor">("id")
  // const [roomAssociated, setRoomAssociated] = React.useState<string>(null)
  const [age, setAge] = React.useState(null);

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
                        <Button variant={mode === 'instructor' ? "contained" : "outlined"} onClick={() => setMode("instructor")}>Lecturer</Button>
                        <Button variant={mode === 'id' ? "contained" : "outlined"} onClick={() => setMode("id")}>Table</Button>
                      </ButtonGroup>
                    </Grid>
                    <Grid>
                      <span style={{
                        marginRight: "10px",
                      }}>Filter by:</span>
                      <Box sx={{
                        display: "inline-block",
                        position: "relative",
                        top: "-14px",
                        minWidth: 200
                      }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">{mode}</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Age"
                            onChange={handleChange}
                          >
                            {extractAvailableInstructors(timetable, mode).map(value => (
                              <MenuItem value={value}>{value}</MenuItem>
                            ))}
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
                  {(mode === 'room' || mode === 'instructor') && <TimetableView
                    timetableProps={age ? filterTimetable(timetable, { field: mode, value: age }) : timetable as any}
                  />}
                  <SolutionTable
                    columns={Object.keys(timetable[0])}
                    data={age ? filterTimetable(timetable, { field: mode, value: age }) : timetable}
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

const extractAvailableInstructors = (timetable: TimetableCellProps[], field: "instructor" | "room" | "id"): string[] => {
  if (field === "instructor")
    return _.uniq(timetable.map(it => it.instructor));
  else if (field === "room")
    return _.uniq(timetable.map(it => it.room));
  else (field === "id")
  return _.uniq(timetable.map(it => it.id));
}

const filterTimetable = (timetable: TimetableCellProps[], criteria: {
  field: "instructor" | "room" | "id",
  value: string
}): TimetableCellProps[] => {
  return timetable.filter(it => it[criteria.field] === criteria.value)
}


interface TimetableCellProps {
  id: string,
  subject: string,
  instructor: string,
  room: string,
  weekday: string,
  period: string,
  time: string,
  entrants: number,
  capableStudents: string[],
  type: "not_available" | "origin" | "new" | "modified" | "new_modified";
}