
import { config } from '../lib/config';
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
  getWhoami: getWhoami,
} as const;

async function getWhoami(): Promise<WhoamiResp> {
  let url: string;
  let rawResp: Response;
  let rawRespBody: unknown;
  let whoamiResp: WhoamiResp;
  url = `${config.EZD_API_BASE_URL}/v1/user/whoami`;
  rawResp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
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
