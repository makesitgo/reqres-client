// https://stackoverflow.com/questions/30498318/es5-object-assign-equivalent
export const mergeObjects = (...args: any[]) => {
  return args.reduce(
    (res, arg) => {
      if (arg !== undefined) {
        Object.keys(arg).forEach(key => res[key] = arg[key]);
      }
      return res;
    },
    {}
  )
};

export const throwError = (msg: string, value: any): never => {
    throw new Error(msg + ": " + JSON.stringify(value));
}
