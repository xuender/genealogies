/**
 * 浅层属性读取
 */
export function shallowProperty(obj: any, key: string): any {
    return obj == null ? void 0 : obj[key];
}
