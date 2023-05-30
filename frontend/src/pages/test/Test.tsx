import axios from 'axios';
import * as React from 'react';
import helpers from 'src/helpers/helpers';
import { IImportedData } from './interface';
import constants from '../../helpers/constants'
import { BKAlert } from 'src/components/Alert/BKAlert';

import Stepper from './Stepper/Stepper';

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
  const [openAlert, setOpenAlert] = React.useState(false)
  const [openInfo, setOpenInfo] = React.useState(false)

  return <div>
    {/* <BKTab tabLabels={["Stepper"]}>
      {[(<Stepper></Stepper>)]}
    </BKTab> */}
    <Stepper></Stepper>
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
