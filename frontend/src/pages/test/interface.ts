export type IImportedData = {
  error: any[];
  rows: IRow[];
  sheetName: string;
}[];

type IRow = {
  [key: string]: string;
};
