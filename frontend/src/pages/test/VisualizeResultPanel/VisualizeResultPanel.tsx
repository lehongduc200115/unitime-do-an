import * as React from "react";
import { FlexCol } from "src/components/FlexCol/FlexCol";
import { BKTable } from "src/components/Table/BKTable";
import TimetableView from "../Timetable/Timetable";
import { Typography } from "@mui/material";

interface IClass {
  id: string,
  subject: string,
  type: string,
  capacity: number,
  weekday: string,
  period: string,
  time: string,
}

type Timetable = IClass[]


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


  React.useEffect(() => {
    setData(props.data.result);
  }, [props.data]);

  return (
    <FlexCol>
      <div className="legend">
        <div className="lec">Lecture</div>
        <div className="lab">Lab</div>
      </div>
      {
        data ? data.map((timetable: Timetable, index: number) => {
          return timetable ?
            (
              <FlexCol>
                <Typography> {`Solution: ${index}`} </Typography>
                <TimetableView
                  timetableProps={timetable as any}
                />
              </FlexCol>
            )
            : ""
        }) : ""
      }
    </FlexCol>
  )
}