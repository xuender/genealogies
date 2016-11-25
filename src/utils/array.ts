/**
 * 浅层属性读取
 */
export function shallowProperty(obj: any, key: string): any {
  return obj == null ? void 0 : obj[key];
}
/**
 * 查找
 */
export function find(array: any[], com: (a: any) => boolean): any {
  if (!array || array.length === 0) {
    return null;
  }
  for (const a of array) {
    if (com(a)) {
      return a;
    }
  }
  return null;
}
export function remove(array: any[], com: (a: any) => boolean): number {
  if (!array || array.length === 0) {
    return 0;
  }
  const ids: number[] = [];
  for (let i = 0; i < array.length; i++) {
    if (com(array[i])) {
      ids.unshift(i);
    }
  }
  for (const i of ids) {
    array.splice(i, 1);
  }
  return ids.length;
}
