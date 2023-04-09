import * as React from "react";
import { FlexCol } from "src/components/FlexCol/FlexCol";
import { BKTable } from "src/components/Table/BKTable";
import TimetableView from "../Timetable/Timetable";
// import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
// import { resultPrinter } from "../utils"
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
  // const [data, setData] = React.useState<any>(resultPrinter(props.visualizeData));
  console.log(`data from VisualizeResultPanel: ${JSON.stringify(props.data.result)}`)
  const [data, setData] = React.useState<any>(props.data.result);
  

  React.useEffect(() => {
    // console.log(`data from VisualizeResultPanel: ${JSON.stringify(props.data)}`)

    setData(props.data.result);
    // console.log(`data from VisualizeResultPanel: ${parseExcel(props.visualizeData)}`)
  }, [props.data]);

  return (
    <FlexCol>
      {
        data ? data.map ((timetable: Timetable, index: number) => {
          // const timeTableAdapted = adaptToTable(timetable)
          return timetable ? 
            // <BKTable 
            //   name={`Solution: ${index}`} 
            //   columns={Object.keys(timetable[0])} 
            //   data={timetable} 
            //   setData={(tableData: any) => {
            //     // console.log(`den day 2: ${JSON.stringify(tableData)}`)
            //     const clonedTable = JSON.parse(JSON.stringify(data));
            //     clonedTable[index].rows = tableData;
            //     // console.log(`den day: ${JSON.stringify(clonedTable[index])}`)
            //     setData(clonedTable);
            //   }}
            // />            
            <TimetableView 
              timetableProps={timetable as any} 
            />
          : ""
        }) : ""
      }
    </FlexCol>
  )
}

 // TODO: gen a period table
// export {}