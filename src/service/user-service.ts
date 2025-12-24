
import { config } from '../lib/config';
import { ResponseError } from '../lib/models/error/response-error';
import { WhoamiResp, whoamiRespSchema } from '../lib/models/whoami-resp';

type LogInBody = {
  userName: string;
  password: string;
} & {};

type LogInUserRes = {
  status: number;
  body: unknown;
} & {};

type LogInUserOpts = {
  username: string;
  password: string;
} & {};

export const userService = {
  logInUser: logInUser,
  logoutUser: logoutUser,
  getWhoami: getWhoami,
} as const;

async function getWhoami(): Promise<WhoamiResp | undefined> {
  let url: string;
  let rawResp: Response;
  let rawRespBody: unknown;
  let whoamiResp: WhoamiResp;
  url = `${config.EZD_API_BASE_URL}/v1/user/whoami`;
  rawResp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if(!rawResp.ok) {
    if(rawResp.status === 401) {
      return;
    } else {
      throw new ResponseError(rawResp);
    }
  }
  rawRespBody = await rawResp.json();
  whoamiResp = whoamiRespSchema.decode(rawRespBody);
  return whoamiResp;
}

async function logInUser(opts: LogInUserOpts) {
  let url: string;
  let rawResp: Response;
  let reqBody: LogInBody;
  let rawRespBody: unknown;
  let res: LogInUserRes;
  url = `${config.EZD_API_BASE_URL}/v1/user/login`;
  reqBody = {
    userName: opts.username,
    password: opts.password,
  };
  rawResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(reqBody),
  });
  rawRespBody = await rawResp.json();
  res = {
    status: rawResp.status,
    body: rawRespBody,
  };
  return res;
}

async function logoutUser() {
  let url = `${config.EZD_API_BASE_URL}/v1/user/logout`;
  let rawResp = await fetch(url, {
    method: 'POST',
    credentials: 'include'
  });
  if(!rawResp.ok) {
    throw new ResponseError(rawResp);
  }
}
