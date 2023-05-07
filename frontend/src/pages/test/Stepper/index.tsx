
import { IImportedData } from '../interface';
import helpers from 'src/helpers/helpers';
import { BKAlert, BKSearch, BKStepper, BKTab, BKTable } from "@components";
import Uploader from "../Uploader";
import axios from 'axios';
import { useState } from 'react';
import constants from '../../../helpers/constants';
import { VisualizeResultPanel } from '../VisualizeResultPanel/VisualizeResultPanel';
import Sheets from '../Sheets';

const steps = ['Import sheets', 'Review and make changes', 'Solve', 'Tune Result'];

const Stepper = () => {
  async function onUpload(file: File) {
    const res = await helpers.xlsxToJson(file)
    // const res = await helpers.xlsxToJson(e.target.files[0]);
    // const sheetNames = await helpers.getSheetNames(e.target.files[0]);
    const dataVisualized = visualizeData(res);
    const tableVisualized = visualizeData2(res);
    setTables(tableVisualized);

    // console.log(`stuck: ${JSON.stringify(dataVisualized.sheets)}`)
    setOpenInfo(!!dataVisualized.importedData)
    const backendSolverResponse = await backendSolver(dataVisualized.importedData);
    const doneSolving = backendSolverResponse && backendSolverResponse.data && backendSolverResponse.data.status === "success"
    setOpenAlert(doneSolving)
    // setOpenError(!doneSolving)
    setBackendresponse(backendSolverResponse);
  }

  const [backendResponse, setBackendresponse] = useState<any>([])
  // const [backendSolvingStatus, setBackendSolvingStatus] = React.useState<any>(false)
  // const [importResult, setImportResult] = React.useState(null)
  // const [fetchResult, setFetchResult] = React.useState(null)
  const [openAlert, setOpenAlert] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)

  const [tables, setTables] = useState<{
    columns: string[],
    rows: object[],
    sheetName: string
  }[]>([]);

  return (
    <>
      <BKStepper
        labels={steps}
      >
        {
          steps.map((it, idx) => {
            let component = <Uploader onUpload={onUpload}></Uploader>

            if (idx === 1) {
              component = <Sheets tables={tables} />
            } else if (idx === 2) {
              return (<div>
                {
                  (backendResponse && backendResponse.data && backendResponse.data.status === "success")
                    // ? (JSON.stringify(backendResponse))
                    ? (<VisualizeResultPanel {...backendResponse.data} />)
                    // ? <Timetable timetableProps={backendResponse.data.data.result[0]}></Timetable>
                    : ""
                }
              </div>)
            }

            return component;
          })
        }
      </BKStepper>
      <BKAlert
        severity="info"
        // title="My Alert"
        open={openInfo}
        onClose={() => { setOpenInfo(false) }}
      >
        Your sheet imported and solving!
      </BKAlert>
      <BKAlert
        severity="success"
        // title="My Alert"
        open={openAlert}
        onClose={() => { setOpenAlert(false) }}
      >
        Backend solved!
      </BKAlert>
    </>
  )
}

const visualizeData = (importedData: IImportedData) => {
  console.log(`importedData: ${JSON.stringify(importedData)}`)
  let sheets: any = helpers.getHeadersFromSchema();
  Object.keys(sheets).forEach((key: string) => {
    sheets[key] = [sheets[key]]
  })
  console.log(`sheets: ${JSON.stringify(sheets)}`)
  importedData.forEach(sheet => {
    const key = helpers.getKeyFromSheetName(sheet.sheetName);
    console.log(`helpers.getKeyFromSheetName(sheet.sheetName): ${key}`)
    // if (key !== "")
    if (key !== constants.DEFAULT_SHEETNAME) {
      console.log(`key: ${key}`)
      console.log(`sheets: ${sheets}`)
      sheets[key] = sheets[key].concat(sheet.rows.map(row => {
        const columnNames = helpers.getColumnNames(sheet.sheetName)
        return columnNames.map(column => {
          return {
            value: (row[column] === undefined) ? "" : row[column]
          }
        })
      }))
    }
    sheets[key] = sheets[key].concat(sheet.rows.map(row => {
      const columnNames = helpers.getColumnNames(sheet.sheetName)
      return columnNames.map(column => {
        return {
          value: (row[column] === undefined) ? "" : row[column]
        }
      })
    }))
  })

  console.log(`sheet: ${JSON.stringify(sheets)}`)
  console.log(`importedData: ${JSON.stringify(importedData)}`)

  return {
    sheets,
    importedData
  };
}

const visualizeData2 = (importedData: IImportedData) => {
  console.log(`importedData: ${JSON.stringify(importedData)}`)

  return importedData.map(table => {
    return {
      rows: table.rows,
      columns: Object.keys(table.rows[0]),
      sheetName: table.sheetName
    }
  });
}

const backendSolver = async (importedData: any) => {
  const ret = await axios.post(`http://localhost:8000/import`, {
    data: importedData.map((it: any) => {
      return {
        data: {
          rows: it.rows,
          sheetName: it.sheetName
        }
      }
    })
  })

  console.log(`ret: ${JSON.stringify(ret)}`)
  return ret;
}

export default Stepper;