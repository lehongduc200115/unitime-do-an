import { BKSearch, BKTab, BKTable } from "@components";
import { useState } from "react";

interface ISheetProps {
  tables: any
}

const Sheets = ({ tables }: ISheetProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event: any) => {
    console.log(`searchTerm: ${event.target.value}`)
    setSearchTerm(event.target.value);
  };

  const regex = searchTerm ? new RegExp(`.*${searchTerm}.*`) : null
  const filterRow = (rows: string[][]) => rows.filter(row => Object.values(row).some(cell => regex.test(cell)))

  // console.log(`debugging table.rows: ${tables[0].rows}`)

  return (
    <>
      <BKSearch onChange={handleChange}></BKSearch>
      <BKTab tabLabels={(tables).map((it: any) => it.sheetName)}>
        {tables.map((table: any, index: number) => <BKTable
          // name={table.sheetName}
          columns={table.columns}
          data={searchTerm ? filterRow(table.rows) : table.rows}
          setData={(tableData) => {
            console.log(`den day 2: ${JSON.stringify(tableData)}`)
            const clonedTable = JSON.parse(JSON.stringify(tables));
            clonedTable[index].rows = tableData;
            // console.log(`den day: ${JSON.stringify(clonedTable[index])}`)
            // setTables(clonedTable);
          }}
        />)}
      </BKTab>    </>
  )
}


export default Sheets;