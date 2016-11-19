/**
 * 浅层属性读取
 */
export function shallowProperty(obj: any, key: string): any {
    return obj == null ? void 0 : obj[key];
}
export function find(array: any[], com: (any) => boolean): any {
  for(const a of array) {
    if (com(a)){
      return a;
    }
  }
  return null;
}
