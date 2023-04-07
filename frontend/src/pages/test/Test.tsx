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

  // const rows = importedData.map(it => it.rows);
  // const columns = rows.map(it => Object.keys(it[0]));
  // // const columns = Object.keys(rows[0]);
  // const names = importedData.map(it => it.sheetName);

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
    const sheetNames = await helpers.getSheetNames(e.target.files[0]);
    const dataVisualized = visualizeData(res);
    const tableVisualized = visualizeData2(res);
    setTables(tableVisualized);

    setSheetNames(sheetNames);
    setResult(res);
    console.log(`stuck: ${JSON.stringify(dataVisualized.sheets)}`)
    setVisualizedParsedData(dataVisualized.sheets);
    setBackendresponse(await backendSolver(dataVisualized.importedData));
  }
  // async function handleOnClick(e: any) {
  //   const obj: Record<string, any> = {}
  //   result.forEach(async it => {
  //     try {
  //       console.log(`request: localhost:8000/${it.sheetName.toLowerCase()}`)
  //       console.log(`body: ${JSON.stringify(it.rows)}`)
  //       const result = await axios({
  //         method: 'post',
  //         url: `http://localhost:8000/${it.sheetName.toLowerCase()}`,
  //         data: it.rows
  //       })
  //       obj[it.sheetName.toLowerCase()] = { result, error: false };
  //     } catch (e) {
  //       console.log(e)
  //       obj[it.sheetName.toLowerCase()] = { result: null, error: true };
  //     }
  //   })
  //   setImportResult(obj);
  // }

  // async function handleOnClickFetch() {
  //   const obj: Record<string, any> = {};
  //   const sheet = [{ sheetName: "subject" }, { sheetName: "room" }, { sheetName: "instructor" }]
  //   sheet.forEach(async it => {
  //     try {
  //       const result = await axios.get(`http://localhost:8000/${it.sheetName.toLowerCase()}`)
  //       obj[it.sheetName.toLowerCase()] = { result, error: false };
  //     } catch (e) {
  //       console.log(e)
  //       obj[it.sheetName.toLowerCase()] = { result: null, error: true };
  //     }
  //   })
  //   setFetchResult(obj);
  // }


  const [result, setResult] = React.useState<IReaderResult[]>([])
  const [visualizedParsedData, setVisualizedParsedData] = React.useState<any>([])
  const [sheetNames, setSheetNames] = React.useState<any>([])
  const [backendResponse, setBackendresponse] = React.useState<any>([])
  // const [importResult, setImportResult] = React.useState(null)
  // const [fetchResult, setFetchResult] = React.useState(null)
  const [openAlert, setOpenAlert] = React.useState(false)
  // const [columns, setColumns] = React.useState([
  //   'name', 'age', 'gender'
  // ]);

  // const [tableName, setTableName] = React.useState(
  //   'default tableName'
  // );

  const [tables, setTables] = React.useState<any>([
    {
      columns: ['name', 'age', 'gender'],
      rows:
        [
          { id: 1, name: 'John Doe', age: 35, gender: 'Male' },
          { id: 2, name: 'Jane Smith', age: 27, gender: 'Female' },
          { id: 3, name: 'Bob Johnson', age: 42, gender: 'Male' },
        ],
      sheetName: 'default tableName'
    }
  ]);

  return <div>
    input file here: <input type="file" id="input" onChange={handleOnChange} />

    {/* <p>result goes here: {JSON.stringify(result)}</p>
    <p>beResponse goes here: {JSON.stringify(backendResponse)}</p> */}
    {
      (backendResponse && backendResponse.data && backendResponse.data.status === "success")
        // ? (JSON.stringify(backendResponse))
        ? (<VisualizeResultPanel {...backendResponse.data} />)
        : ""
    }

    <Button onClick={() => { setOpenAlert(true) }}>
      show alert
    </Button>
    <BKAlert
      severity="success"
      // title="My Alert"
      open={openAlert}
      onClose={() => { setOpenAlert(false) }}
    >
      This is a success message!
    </BKAlert>
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

  </div>
}
