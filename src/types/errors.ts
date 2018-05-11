export interface ErrorConstructor {
    captureStackTrace(thisArg: any, func: any): void
}

class ReqresError extends Error {
  public name: string = 'ReqresError';
  public response?: Response;
  public payload?: string;

  constructor(
    public message: string,
    public code: number = 400,
  ) {
    super(message);

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

export { ReqresError };
