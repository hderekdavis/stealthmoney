export function firstOrDefault<T>(arr: T[]): T {
  let res = null;
  if (arr && arr instanceof Array && arr.length > 0) {
    res = arr[0];
  }
  return res;
}

export function rowsToArray<T>(arr: T[], key: string): T {
  let res = null;
  if (arr && arr instanceof Array && arr.length > 0) {
    res = arr.map((row: any) => row[key]);
  }
  return res;
}

export function discardNulls<T>(obj: T): T {
  const res: T = {} as any;
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (
        obj[key] !== null &&
        obj[key] !== undefined &&
        !Number.isNaN(obj[key])
      ) {
        res[key] = obj[key];
      }
    });
  }
  return res;
}
