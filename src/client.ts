import 'fetch-everywhere';
import * as queryString from 'query-string';
import {
  UserAccess,
  UserCreds,
  UserList,
  UserRequest,
  UsersApi,
  ReqresError,
  ApiOptions,
  ClientOptions,
  FetchArgs,
  Http,
  HttpArgs,
  HttpMethod,
  QueryParams
} from './types';
import { mergeObjects } from './util';

const DEFAULT_REQRES_URL = 'https://reqres.in/api';

const JSON_TYPE = 'application/json';
const TEXT_TYPE = 'text/plain';

const containsJsonType = (res: Response) => containsContentType(res, JSON_TYPE);
const containsPlainText = (res: Response) => containsContentType(res, TEXT_TYPE);

const containsContentType = (res: Response, contentType: string) => {
  const contentTypes = res.headers.get('Content-Type') || '';
  return contentTypes.split(';').indexOf(contentType) >= 0;
};

const newReqresClient = (prototype: object, options: ClientOptions = {}): Promise<ReqresClient> => {
  const reqresClient = Object.create(prototype);

  let baseUrl = DEFAULT_REQRES_URL;
  if (options.baseUrl) {
    baseUrl = options.baseUrl;
  }

  reqresClient.baseUrl = baseUrl;

  return Promise.resolve(reqresClient);
};

export class ReqresClient {
  private baseUrl: string;

  constructor() {
    throw new ReqresError('ReqresClient can only be obtained from the ReqresClientFactory.create function');
  }

  get _http(): Http {
    const send = (resource: string, method: HttpMethod, options?: ApiOptions) =>
      this._do(resource, method, mergeObjects({ apiVersion: 1 }, options)).then(response => {
        if (containsJsonType(response)) {
          return response.json();
        }
        return response;
      });

    return {
      _get: (path: string, params?: QueryParams) =>
        params ? send(path, HttpMethod.GET, { queryParams: params }) : send(path, HttpMethod.GET),
      _post: <RQST>(path: string, data: RQST, params?: QueryParams) =>
        params
          ? send(path, HttpMethod.POST, { body: JSON.stringify(data), queryParams: params })
          : send(path, HttpMethod.POST, { body: JSON.stringify(data) }),
      _put: <RQST>(path: string, data?: RQST) =>
        data
          ? send(path, HttpMethod.PUT, { body: JSON.stringify(data) })
          : send(path, HttpMethod.PUT),
      _patch: <RQST>(path: string, data?: RQST) =>
        data
          ? send(path, HttpMethod.PATCH, { body: JSON.stringify(data) })
          : send(path, HttpMethod.PATCH),
      _delete: (path: string) => send(path, HttpMethod.DELETE)
    };
  }

  login(creds: UserCreds): Promise<UserAccess> {
    return this._http._post('/login', creds);
  }

  register(creds: UserCreds): Promise<UserAccess> {
    return this._http._post('/register', creds);
  }

  users(): UsersApi {
    const http = this._http;
    const usersUrl = '/users';
    return {
      list: () => http._get<UserList>(usersUrl),
      create: (data: UserRequest) => http._post(usersUrl, data),
      user: (userId: number) => {
        const userUrl = `${usersUrl}/${userId}`;
        return {
          get: () => http._get(userUrl),
          remove: () => http._delete(userUrl),
          update: (data: UserRequest) => http._put(userUrl, data),
          modify: (data: UserRequest) => http._patch(userUrl, data)
        };
      }
    };
  }

  _fetch(url: string, args: HttpArgs) {
    return fetch(url, args).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      if (containsJsonType(response)) {
        return response.json().then(payload => Promise.reject(payload));
      }

      if (containsPlainText(response)) {
        return response.text().then(payload => Promise.reject(payload));
      }

      return Promise.reject({ type: 'system', message: response.statusText });
    });
  }

  _args(resource: string, method: HttpMethod, options: ApiOptions): FetchArgs {
    let url = `${this.baseUrl}${resource}`;

    if (options.queryParams) {
      url = `${url}?${queryString.stringify(options.queryParams)}`;
    }

    const args: HttpArgs = {
      method,
      cors: true,
      headers: { Accept: JSON_TYPE, 'Content-Type': JSON_TYPE }
    };

    if (options.body) {
      args.body = options.body;
    }

    if (!!options.headers) {
      args.headers = mergeObjects(args.headers, options.headers);
    }

    return { url, args };
  }

  _do(resource: string, method: HttpMethod, options: ApiOptions) {
    options = mergeObjects({ apiVersion: 1 }, options);

    let { url, args } = this._args(resource, method, options);

    if (options.auth) {
      return Promise.reject({ type: 'auth', message: 'auth is not yet supported' });
    }

    return this._fetch(url, args);
  }
}

export class ReqresClientFactory {
  constructor() {
    throw new ReqresError('ReqresClient can only be obtained from the ReqresClientFactory.create function');
  }

  static create(options: ClientOptions) {
    return newReqresClient(ReqresClient.prototype, options);
  }
}
