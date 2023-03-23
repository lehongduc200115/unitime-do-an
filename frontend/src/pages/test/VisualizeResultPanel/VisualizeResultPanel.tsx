import * as React from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import parseExcel from "../utils"

export const VisualizeResultPanel = (
  props: { 
    visualizeData: {
      point: number,
      classes: Object[]
    }[] 
  }
) => {
  console.log("vaoday")
  const [data, setData] = React.useState<any>(parseExcel(props.visualizeData));

  React.useEffect(() => {
    setData(parseExcel(props.visualizeData));
    console.log(`data from VisualizeResultPanel: ${parseExcel(props.visualizeData)}`)
  }, [props.visualizeData]);

  return (
    <div>
      {
        data.map ((dataa: any) => {
          return dataa ? 
            <div>
              <p className="font-weight-bold">{`point: ${dataa.point}`}</p>
              <Spreadsheet data={dataa.initTable} />
              <br />
            </div>
          : ""
        })
      }
    </div>
  )
}