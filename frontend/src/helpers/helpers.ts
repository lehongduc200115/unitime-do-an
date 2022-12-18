import readXlsxFile from "read-excel-file";
import { readSheetNames } from "read-excel-file";
import _ from "lodash";
import { timetableMapping, excelSchemaMapping } from "./xlsx/mapping";

interface IReaderOptions {
  isTimetableEmbedded: boolean;
}

export interface IReaderResult {
  error: any;
  sheetName: string;
  rows: any;
}

function getMappingName(tableName: string): string {
  return _.camelCase(tableName);
}

async function xlsxToJson(
  file: File,
  readerOptions: IReaderOptions
): Promise<IReaderResult[]> {
  try {
    const sheetNames = await getSheetNames(file);
    const sheetEmbedTimetable = Object.keys(timetableMapping);

    return await Promise.all(
      sheetNames
        .filter((it) => !it.endsWith("Timetable"))
        .map(async (sheet) => {
          console.log(`sheet: ${sheet}`);
          if (
            readerOptions.isTimetableEmbedded &&
            sheetEmbedTimetable.includes(getMappingName(sheet))
          ) {
            console.log(
              `map: ${
                excelSchemaMapping[
                  getMappingName(timetableMapping[getMappingName(sheet)].table)
                ]
              }`
            );
            console.log(
              `sheet: ${timetableMapping[getMappingName(sheet)].table}`
            );
            const { rows: timetableRows, errors: timetableErrors } =
              await readXlsxFile(file, {
                map: excelSchemaMapping[
                  getMappingName(timetableMapping[getMappingName(sheet)].table)
                ],
                sheet: timetableMapping[getMappingName(sheet)].table,
              });
            const { rows, errors } = await readXlsxFile(file, {
              map: excelSchemaMapping[getMappingName(sheet)],
              sheet: sheet,
            });
            const booleanTimetable = parseTimetableToBooleans(
              timetableRows,
              sheet
            );
            return {
              error: errors,
              rows: rows.map((it) => {
                return {
                  ...it,
                  weeklyTimetable: booleanTimetable[(it as any).id],
                };
              }),
              sheetName: sheet,
            };
          } else {
            const { rows, errors } = await readXlsxFile(file, {
              map: excelSchemaMapping[getMappingName(sheet)],
              sheet: sheet,
            });
            return {
              error: errors,
              rows: rows,
              sheetName: sheet,
            };
          }
        })
    );
  } catch (e) {
    console.log(e);
  }
}

async function getSheetNames(file: File) {
  return await readSheetNames(file);
}

function parseTimetableToBooleans(rows: any[], sheet: string) {
  const associatedObject: Record<string, any> = {};
  rows.forEach((row) => {
    const associatedKey = row[timetableMapping[getMappingName(sheet)].refId];
    if (!associatedObject[associatedKey]) {
      associatedObject[associatedKey] = Array.apply(null, Array(5)).map((it) =>
        JSON.parse(
          JSON.stringify(Array.apply(null, Array(11)).map((it) => false))
        )
      );
    }

    associatedObject[associatedKey][parseInt(row.weekday)][row.period - 2] =
      true;
  });
  return associatedObject;
}

export default {
  xlsxToJson,
  getSheetNames,
};
