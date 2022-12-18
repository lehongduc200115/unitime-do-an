import axios from 'axios';
import * as React from 'react';
import helpers from 'src/helpers/helpers';
import { IReaderResult } from '../../helpers/helpers';

export default function Test() {
  async function handleOnChange(e: any) {
    const res = await helpers.xlsxToJson(e.target.files[0], {
      "isTimetableEmbedded": true
    })
    setResult(res);
  }
  async function handleOnClick(e: any) {
    const obj: Record<string, any> = {}
    result.forEach(async it => {
      try {
        console.log(`request: localhost:8000/${it.sheetName.toLowerCase()}`)
        console.log(`body: ${JSON.stringify(it.rows)}`)
        const result = await axios({
          method: 'post',
          url: `http://localhost:8000/${it.sheetName.toLowerCase()}`,
          data: it.rows
        })
        obj[it.sheetName.toLowerCase()] = { result, error: false };
      } catch (e) {
        console.log(e)
        obj[it.sheetName.toLowerCase()] = { result: null, error: true };
      }
    })
    setImportResult(obj);
  }

  async function handleOnClickFetch() {
    const obj: Record<string, any> = {};
    const sheet = [{ sheetName: "subject" }, { sheetName: "room" }, { sheetName: "lecturer" }]
    sheet.forEach(async it => {
      try {
        const result = await axios.get(`http://localhost:8000/${it.sheetName.toLowerCase()}`)
        obj[it.sheetName.toLowerCase()] = { result, error: false };
      } catch (e) {
        console.log(e)
        obj[it.sheetName.toLowerCase()] = { result: null, error: true };
      }
    })
    setFetchResult(obj);
  }

  const [result, setResult] = React.useState<IReaderResult[]>([])
  const [importResult, setImportResult] = React.useState(null)
  const [fetchResult, setFetchResult] = React.useState(null)
  return <div>
    input file here: <input type="file" id="input" onChange={handleOnChange} />

    <p>result goes here: {JSON.stringify(result)}</p>
    <br />
    <br />
    <br />
    <p>import goes here: <button onClick={handleOnClick}>import</button></p>

    <p>result import goes here: {JSON.stringify(importResult)}</p>
    <br />
    <br />
    <br />
    <p>fetch goes here: <button onClick={handleOnClickFetch}>fetch</button></p>

    <p>result fetch goes here: {JSON.stringify(fetchResult)}</p>
  </div>
}
