
// export type HttpClientReqOpts = {
//   /* bearer token _*/
//   authToken?: string;
//   headers?: HeaderRecord;
//   body?: unknown;
//   bodyInit?: RequestInit['body'];
// } & {};

import { EzdError } from '../models/error/ezd-error';

type HeaderRecOpt = Record<string, string | undefined>;
type HeaderRec = Record<string, string>;
type FetchClientReqOpts = {
  authToken?: string;
  headers?: HeaderRecOpt;
  body?: unknown;
  bodyInit?: RequestInit['body'];
  credentials?: RequestInit['credentials'];
} & {};

const defaultHeaders: HeaderRecOpt = {
  'Content-Type': 'application/json',
};

/* utility class that wraps fetch() _*/
export class FetchClient {
  private _token?: string;
  private _headers?: HeaderRecOpt;
  private constructor(token?: string, headers?: HeaderRecOpt) {
    this._token = token;
    this._headers = headers ?? Object.assign({}, defaultHeaders);
  }
  static init(): FetchClient {
    return new FetchClient();
  }
  get(url: string, opts: FetchClientReqOpts = {}): Promise<Response> {
    let reqInit: RequestInit = {
      headers: this.getHeadersOpt(opts),
      body: getBodyOpt(opts),
      credentials: opts.credentials ?? 'include',
    };
    return fetch(url, reqInit);
  }
  post(url: string, opts: FetchClientReqOpts = {}): Promise<Response> {
    let reqInit: RequestInit = {
      method: 'POST',
      headers: this.getHeadersOpt(opts),
      body: getBodyOpt(opts),
      credentials: opts.credentials ?? 'include',
    };
    console.log(reqInit);
    return fetch(url, reqInit);
  }
  delete(url: string, opts: FetchClientReqOpts = {}): Promise<Response> {
    opts.headers ??= {};
    /* explicitly set to undefined so the default gets unset if present _*/
    opts.headers['Content-Type'] ??= undefined;
    let reqInit: RequestInit = {
      method: 'DELETE',
      headers: this.getHeadersOpt(opts),
      body: getBodyOpt(opts),
    };
    return fetch(url, reqInit);
  }
  /* wCt = with content type _*/
  wCt(contentType?: string | undefined): FetchClient {
    let headers = Object.assign({}, this._headers);
    if(contentType === undefined) {
      delete headers['Content-Type'];
    } else {
      headers['Content-Type'] = contentType;
    }
    return new FetchClient(this._token, headers);
  }
  private getHeadersOpt(opts: FetchClientReqOpts): HeaderRec {
    let headersOpt = Object.assign({}, this._headers, opts.headers);
    let headers: HeaderRec = {};
    /* delete undefined entries _*/
    if(opts.authToken !== undefined || this._token !== undefined) {
      let token = opts.authToken ?? this._token;
      headersOpt['Authorization'] = `Bearer ${token}`;
    }
    for(let k in headersOpt) {
      if(headersOpt[k] !== undefined) {
        headers[k] = headersOpt[k];
      }
    }
    return headers;
  }
}

function getBodyOpt(opts: FetchClientReqOpts): RequestInit['body'] {
  let body: RequestInit['body'];
  if(opts.body !== undefined && opts.bodyInit !== undefined) {
    throw new EzdError('Cannot include both \'body\' and \'bodyInit\'', 'EZDW_0.2');
  } else if(opts.body !== undefined) {
    body = JSON.stringify(opts.body);
  } else if(opts.bodyInit !== undefined) {
    body = opts.bodyInit;
  }
  return body;
}
