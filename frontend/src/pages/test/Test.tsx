import axios from 'axios';
import * as React from 'react';
import helpers from 'src/helpers/helpers';
import { IReaderResult } from '../../helpers/helpers';
import { IImportedData } from './interface';
import constants from '../../helpers/constants'
import { VisualizePanel } from './VisualizePanel/VisualizePanel';
import { VisualizeResultPanel } from './VisualizeResultPanel/VisualizeResultPanel';

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

  return {
    sheets,
    importedData
  };
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
  return <div>
    input file here: <input type="file" id="input" onChange={handleOnChange} />

    <p>result goes here: {JSON.stringify(result)}</p>
    <p>beResponse goes here: {JSON.stringify(backendResponse)}</p>
    {/* <br />
    <br />
    <br />
    <p>import goes here: <button onClick={handleOnClick}>import</button></p>

    <p>result import goes here: {JSON.stringify(importResult)}</p>
    <br />
    <br />
    <br />
    <p>fetch goes here: <button onClick={handleOnClickFetch}>fetch</button></p>

    <p>result fetch goes here: {JSON.stringify(fetchResult)}</p> */}
    {
      (backendResponse && backendResponse.data && backendResponse.data.status === "success")
      ? (<VisualizeResultPanel visualizeData={backendResponse.data.data.result}/>)
      : ""
    }
    
    <VisualizePanel visualizeData={() => visualizedParsedData}></VisualizePanel>
    {/* <Spreadsheet data={[data["class"]] as any || []}></Spreadsheet> */}
    <p>sheetname: {sheetNames}</p>
  </div>
}
