export const utils = {
  fillWith: (arr: Array<any>, expectedLength: number, x: any) => {
    arr.length = expectedLength;
    return Array.from(arr, (v) => (v ? v : x));
  },
};
