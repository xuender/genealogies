/**
 * 浅层属性读取
 */
export function shallowProperty(obj: any, key: string): any {
  return obj == null ? void 0 : obj[key];
}
// 过滤
export function filter<T>(array: T[], com: (a: T) => boolean): T[] {
  const ret: T[] = [];
  if (array && array.length > 0) {
    for (const a of array) {
      if (com(a)) {
        ret.push(a);
      }
    }
  }
  return ret;
}
// 统计数量
export function count<T>(array: T[], com: (a: T) => boolean): number {
  let ret: number = 0;
  if (array && array.length > 0) {
    for (const a of array) {
      if (com(a)) {
        ret += 1;
      }
    }
  }
  return ret;
}
/**
 * 查找
 */
export function find<T>(array: T[], com: (a: T) => boolean): T {
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
export function remove<T>(array: T[], com: (a: T) => boolean): number {
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
