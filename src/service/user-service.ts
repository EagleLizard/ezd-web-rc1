
import { FetchClient } from '../lib/client/fetch-client';
import { config } from '../lib/config';
import { EzdPermission } from '../lib/models/authz/ezd-permission';
import { EzdError } from '../lib/models/error/ezd-error';
import { ResponseError } from '../lib/models/error/response-error';
import { EzdUserResp } from '../lib/models/user/ezd-user-resp';
import { WhoamiResp, whoamiRespSchema } from '../lib/models/whoami-resp';

type LogInUserRes = {
  status: number;
  body: unknown;
} & {};

type LogInUserOpts = {
  username: string;
  password: string;
} & {};

const _fc = FetchClient.init();

export const userService = {
  logInUser: logInUser,
  logoutUser: logoutUser,
  getWhoami: getWhoami,
  getUserPerms: getUserPerms,
  getUsers: getUsers,
} as const;

async function getUsers(): Promise<EzdUserResp[]> {
  let usp = new URLSearchParams({
    roles: 'true',
    permissions: 'true',
  });
  let url = `${config.EZD_API_BASE_URL}/v1/user?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawResp = await resp.json();
  if(!Array.isArray(rawResp)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let users = rawResp.map(EzdUserResp.decode);
  return users;
}

async function getWhoami(): Promise<WhoamiResp | undefined> {
  let url = `${config.EZD_API_BASE_URL}/v1/user/whoami`;
  let rawResp = await _fc.get(url);
  if(!rawResp.ok) {
    if(rawResp.status === 401) {
      return;
    } else {
      throw new ResponseError(rawResp);
    }
  }
  let rawRespBody = await rawResp.json();
  let whoamiResp = whoamiRespSchema.decode(rawRespBody);
  return whoamiResp;
}

async function getUserPerms(userId: string): Promise<EzdPermission[]> {
  let url = `${config.EZD_API_BASE_URL}/v1/user/${userId}/permission`;
  let rawResp = await _fc.get(url);
  if(!rawResp.ok) {
    throw new ResponseError(rawResp);
  }
  let rawBody = await rawResp.json();
  if(!Array.isArray(rawBody)) {
    throw new Error(`Expected response to be array, got: ${typeof rawBody}`);
  }
  return rawBody.map((rawPerm) => EzdPermission.decode(rawPerm));
}

async function logInUser(opts: LogInUserOpts): Promise<LogInUserRes> {
  let url = `${config.EZD_API_BASE_URL}/v1/user/login`;
  let rawResp = await _fc.post(url, {
    body: {
      userName: opts.username,
      password: opts.password,
    },
  });
  let rawRespBody = await rawResp.json();
  let res: LogInUserRes = {
    status: rawResp.status,
    body: rawRespBody,
  };
  return res;
}

async function logoutUser() {
  let url = `${config.EZD_API_BASE_URL}/v1/user/logout`;
  let rawResp = await _fc.wCt().post(url);
  if(!rawResp.ok) {
    throw new ResponseError(rawResp);
  }
}
