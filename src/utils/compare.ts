export function isEqualObject(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqualObject(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

export function isMapsOptionsEqual(map1: Map<string, string>, map2: Map<string, string>) {
    console.log(map1);
    console.log(map2);
  if (map1.size !== map2.size) return false;
  for (let [key, value] of map1) {
    if (!map2.has(key) || map2.get(key) !== value) {
      return false;
    }
  }

  return true;
}
