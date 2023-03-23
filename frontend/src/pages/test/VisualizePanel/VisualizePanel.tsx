import * as React from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

export const VisualizePanel = (props: { visualizeData: Object }) => {
  const [data, setData] = React.useState<any>(props.visualizeData);

  React.useEffect(() => {
    setData(props.visualizeData);
    console.log(`data from VisualizePanel: ${JSON.stringify(data)}`)
  }, [props.visualizeData]);

  return <>
    {
      Object.keys(data).map((it) => {
        // console.log(Object.keys(data))
        return <div>
          <p className="font-weight-bold">{`sheetName: ${it}`}</p>
          <Spreadsheet data={data[it] as any} />
          <br />
        </div>
      })
    }
  </>
}