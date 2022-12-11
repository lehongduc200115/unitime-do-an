import * as React from 'react';
import helpers from 'src/helpers/helpers';
import mapping from '../../helpers/xlsx/mapping';
import { IReaderResult } from '../../helpers/helpers';

export default function Test() {
  async function handleOnChange(e: any) {
    const res = await helpers.xlsxToJson(e.target.files[0], {
      map: mapping.subject
    })
    setResult(res);
  }
  const [result, setResult] = React.useState<IReaderResult[]>([])
  return <div>
    input file here: <input type="file" id="input" onChange={handleOnChange} />

    <p>result goes here: {JSON.stringify(result)}</p>
    <br />
  </div>
}
