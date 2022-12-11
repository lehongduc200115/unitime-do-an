import readXlsxFile from "read-excel-file";
import { readSheetNames } from "read-excel-file";

interface IReaderOptions {
  map: any;
  sheet?: string | number;
}

export interface IReaderResult {
  error: any;
  sheetName: string;
  rows: any;
}

async function xlsxToJson(
  file: File,
  readerOptions: IReaderOptions
): Promise<IReaderResult[]> {
  try {
    const sheetNames = await getSheetNames(file);
    const { rows, errors } = await readXlsxFile(file, readerOptions);
    return sheetNames.map((sheet) => {
      if (!readerOptions.sheet || readerOptions.sheet == sheet)
        return {
          error: errors,
          rows: rows,
          sheetName: sheet,
        };
    });
  } catch (e) {
    console.log(e);
  }
  // return await readXlsxFile(file, readerOptions);
}

async function getSheetNames(file: File) {
  return await readSheetNames(file);
}

export default {
  xlsxToJson,
  getSheetNames,
};
