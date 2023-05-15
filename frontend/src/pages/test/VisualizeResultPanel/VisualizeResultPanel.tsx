import * as React from "react";
import { FlexCol } from "src/components/FlexCol/FlexCol";
// import { BKTable } from "src/components/Table/BKTable";
import TimetableView from "../Timetable/Timetable";
import { Button } from "@mui/material";

import { hue } from "../Timetable/Timetable"
import { BKTab, BKTable } from "@components";
import _ from "lodash";
// import { exportToExcel } from 'react-json-to-excel';

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
  const [roomAssociated, setRoomAssociated] = React.useState<string>(null)


  React.useEffect(() => {
    setData(props.data.result);
  }, [props.data]);

  // type x = keyof IEngineOutputClass

  return (
    <FlexCol>
      <BKTab tabLabels={_.range(data.length).map((it) => `Solution ${it + 1}`)}>
        {
          data ? data.map((timetable: Timetable) => {
            return timetable ?
              (
                <FlexCol>
                  {/* <Button onClick={() => exportToExcel(timetable, 'timetable')}>Export Timetable</Button> */}
                  <div className="legend">

                    {Object.keys(hue).map((status) => (
                      <div style={{
                        backgroundColor: hue[status as keyof typeof hue]
                      }}>{status}</div>
                    ))}
                  </div>
                  <TimetableView
                    timetableProps={timetable as any}
                  />
                  <BKTable
                    columns={Object.keys(timetable[0])}
                    data={timetable}
                    setData={() => { }}
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