import axios from 'axios';
import * as React from 'react';
import helpers from 'src/helpers/helpers';
import { IReaderResult } from '../../helpers/helpers';
import { IImportedData } from './interface';
import constants from '../../helpers/constants'
import { VisualizePanel } from './VisualizePanel/VisualizePanel';
import { VisualizeResultPanel } from './VisualizeResultPanel/VisualizeResultPanel';
import { Button } from '@mui/material';
import { BKAlert } from 'src/components/Alert/BKAlert';
import { BKTable } from 'src/components/Table/BKTable';
import { clone } from 'lodash';
import { BKTab } from 'src/components';
import Timetable from './Timetable/Timetable';

import { Notification } from 'src/components/Notification/Notification';
import Stepper from './Stepper';

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


export default function Test() {
  async function handleOnChange(e: any) {
    const res = await helpers.xlsxToJson(e.target.files[0]);
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

  const [backendResponse, setBackendresponse] = React.useState<any>([])
  // const [backendSolvingStatus, setBackendSolvingStatus] = React.useState<any>(false)
  // const [importResult, setImportResult] = React.useState(null)
  // const [fetchResult, setFetchResult] = React.useState(null)
  const [openAlert, setOpenAlert] = React.useState(false)
  const [openInfo, setOpenInfo] = React.useState(false)

  const [tables, setTables] = React.useState<{
    columns: string[],
    rows: object[],
    sheetName: string
  }[]>([]);

  return <div>
    <BKTab tabLabels={["Test playground", "Stepper", "Solutions"]}>
      <Timetable timetableProps={backendResponse}></Timetable>
      {/* <div>
        {
          tables.map((table: any, index: number) => {
            console.log(`$$$ ${table.sheetName} ${JSON.stringify(table.columns)} ${JSON.stringify(table.rows)}`)
            return (
              <BKTable
                name={table.sheetName}
                columns={table.columns}
                data={table.rows}
                setData={(tableData) => {
                  console.log(`den day 2: ${JSON.stringify(tableData)}`)
                  const clonedTable = JSON.parse(JSON.stringify(tables));
                  clonedTable[index].rows = tableData;
                  console.log(`den day: ${JSON.stringify(clonedTable[index])}`)
                  setTables(clonedTable);
                }}
              />
            );
          })
        }
      </div> */}
      {(<Stepper></Stepper>)}
      <div>
        {
          (backendResponse && backendResponse.data && backendResponse.data.status === "success")
            // ? (JSON.stringify(backendResponse))
            ? (<VisualizeResultPanel {...backendResponse.data} />)
            // ? <Timetable timetableProps={backendResponse.data.data.result[0]}></Timetable>
            : ""
        }
      </div>
    </BKTab>
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

  </div>
}
