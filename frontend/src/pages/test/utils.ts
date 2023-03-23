export default (listObject: {
  point: number,
  classes: Object[]
}[]) => {
  const keys = (listObject.length === 0) ? [] : Object.keys(listObject[0].classes[0]);
  console.log(`keys: ${JSON.stringify(keys)}`)
  const firstRow = [
    keys.map(key => {
      return { value: key }
    })
  ]
  console.log(`firstRow: ${JSON.stringify(firstRow)}`)

  return listObject.map(object => {
    const firstRowCopy = JSON.parse(JSON.stringify(firstRow));
    const initTable = firstRowCopy
    object.classes.forEach(it => {
      initTable.push(Object.values(it).map(data => {return {value: JSON.stringify(data)}}))
    })
    console.log(`initTable: ${JSON.stringify(initTable)}`)
    return {
      initTable,
      point: object.point
    }
  });
}