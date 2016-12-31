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

export function remove<T>(array: T[], com: (a: T) => boolean): T[] {
  if (!array || array.length === 0) {
    return array;
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
  return array;
}
