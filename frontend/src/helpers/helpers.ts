import readXlsxFile from "read-excel-file";
import { readSheetNames } from "read-excel-file";
import _ from "lodash";
import { timetableMapping, excelSchemaMapping } from "./xlsx/mapping";
import constants from "./constants";

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

async function xlsxToJson(file: File): Promise<IReaderResult[]> {
  try {
    const sheetNames = await getSheetNames(file);

    return Promise.all(
      sheetNames.map(async (sheetName) => {
        const { rows, errors } = await readXlsxFile(file, {
          map: excelSchemaMapping[getMappingName(sheetName)],
          sheet: sheetName,
        });

        return {
          error: errors,
          rows: rows,
          sheetName: sheetName,
        };
      })
    );
  } catch (e) {
    console.log("error while handling excel reader: ", e);
  }
}

async function xlsxToJson2(
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
  return await (
    await readSheetNames(file)
  ).filter((it) => Object.values(timetableMapping).map((it) => it.table));
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

function getHeadersFromSchema() {
  const res: { [key: string]: { value: string }[] } = {};

  Object.keys(excelSchemaMapping).map((key) => {
    if (res[key] == undefined) res[key] = [];
    Object.keys(excelSchemaMapping[key]).forEach((it) => {
      res[key].push({ value: it });
    });
  });

  return res;
}

function getKeyFromSheetName(sheetName: string): string {
  const sheetNames = Object.keys(timetableMapping).filter(
    (key: string): boolean => {
      return timetableMapping[key].table === sheetName;
    }
  );

  return sheetNames.length >= 1 ? sheetNames[0] : constants.DEFAULT_SHEETNAME;
}

function getColumnNames(sheetName: string): string[] {
  const key = getKeyFromSheetName(sheetName);
  const sheetSchema = excelSchemaMapping[key];
  return Object.values(sheetSchema || {});
}

export default {
  xlsxToJson,
  getSheetNames,
  getHeadersFromSchema,
  getKeyFromSheetName,
  getColumnNames,
};
