import * as React from "react";
import { FlexCol } from "src/components/FlexCol/FlexCol";
import TimetableView from "../Timetable/Timetable";

import { hue } from "../Timetable/Timetable"
import { BKTab, BKTable } from "@components";
import _ from "lodash";
import { SolutionTable } from "./SolutionTable";
import { Button, ButtonGroup, Divider, Grid } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from "@mui/system/Box";
import RightPanel from "../RightPanel/RightPanel";

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
  const [selected, setSelected] = React.useState<string>(null);
  const [mode, setMode] = React.useState<"id" | "room" | "instructor">("id")
  // const [roomAssociated, setRoomAssociated] = React.useState<string>(null)
  const [age, setAge] = React.useState(null);
  const [showPanel, setShowPanel] = React.useState(true)

  const togglePanel = () => {
    setShowPanel(isShow => !isShow)
  }
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
                <>
                  <Grid container spacing={2}>
                    {/* <Button onClick={() => exportToExcel(timetable, 'timetable')}>Export Timetable</Button> */}
                    <Grid item xs>
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
                                <MenuItem value={null}>*</MenuItem>
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
                      {(mode === 'room' || mode === 'instructor') && <div>
                        <TimetableView
                          timetableProps={age ? filterTimetable(timetable, { field: mode, value: age }) : timetable as any}
                          setSelected={setSelected}
                        />
                        <hr></hr>
                      </div>}
                      <SolutionTable
                        columns={Object.keys(timetable[0])}
                        data={age ? filterTimetable(timetable, { field: mode, value: age }) : timetable}
                        setData={() => { }}
                        setViewData={() => setViewData}
                      />
                    </Grid>
                    {showPanel && <Grid item xs={4}>
                      <RightPanel data={timetable.find(it => it.id === selected)} togglePanel={togglePanel} showPanel={showPanel} ></RightPanel>
                    </Grid>}
                  </Grid>
                </>
              )
              : ""
          }) : ""
        }
      </BKTab >
      <Button
        style={{
          // position: 'absolute',
          // top: '100px',
          // right: '100px',
          padding: '4px',
          borderRadius: '40%',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          marginTop: '4px',
          marginLeft: '4px'
        }}
        sx={{
          "&:hover": {
            backgroundColor: '#fff',
          }
        }}
        onClick={togglePanel}
      >
        {showPanel ? "expand" : '<<'}
      </Button>
    </FlexCol >
  )
}

const extractAvailableInstructors = (timetable: TimetableCellProps[], field: "instructor" | "room" | "id"): string[] => {
  if (field === "instructor")
    return _.uniq(timetable.map(it => it.instructor));
  else if (field === "room")
    return _.uniq(timetable.map(it => it.room));

  return _.uniq(timetable.map(it => it.id));
}

const filterTimetable = (timetable: TimetableCellProps[], criteria: {
  field: "instructor" | "room" | "id",
  value: string
}): TimetableCellProps[] => {
  const ret = timetable.filter(it => it[criteria.field] === criteria.value)

  return ret.length === 0 ? timetable : ret;
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