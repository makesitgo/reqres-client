export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export interface HttpHeaders {
  [key: string]: string;
}

export interface QueryParams {
  [key: string]: any;
}

export interface HttpArgs {
  method: string;
  headers?: HttpHeaders;
  body?: string;
  cors?: boolean;
}

export interface Http {
  _get: <RES>(path: string, params?: QueryParams) => Promise<RES>;
  _post: <RQST, RES>(path: string, data: RQST, params?: QueryParams) => Promise<RES>;
  _put: <RQST, RES>(path: string, data?: RQST) => Promise<RES>;
  _patch: <RQST, RES>(path: string, data?: RQST) => Promise<RES>;
  _delete: <RES>(path: string) => Promise<RES>;
}

export interface FetchArgs {
  url: string;
  args: HttpArgs;
}

export interface ApiOptions {
  apiVersion?: number;
  auth?: boolean;
  headers?: HttpHeaders;
  body?: string;
  queryParams?: QueryParams;
}

export interface ClientOptions {
  baseUrl?: string;
}
