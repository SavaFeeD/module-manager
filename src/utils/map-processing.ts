export function of<T, M>(mapper: Map<T, M>) {
  const entryList = Array.from(mapper.entries());
  return entryList.map((entry) => {
    return {
      key: entry[0],
      value: entry[1],
    };
  });
};

export function compose<T>(functions: ((arg: any) => T)[]) {
  return functions.reduce((acc, fn) => {
    return (arg: any) => fn(acc(arg));
  });
}
