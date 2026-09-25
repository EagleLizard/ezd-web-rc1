
import { FetchClient } from '../lib/client/fetch-client';
import { config } from '../lib/config';
import { EzdError } from '../lib/models/error/ezd-error';
import { ResponseError } from '../lib/models/error/response-error';
import { GcpNamespace } from '../lib/models/jcd/gcd-namespace';
import { GcpKeyDto } from '../lib/models/jcd/gcp-key-dto';
import { JcdEnvCopyResDto } from '../lib/models/jcd/jcd-env-copy-res-dto';
import { JcdProjKeyDto } from '../lib/models/jcd/jcd-proj-key-dto';
import { JcdProjPreview } from '../lib/models/jcd/jcd-proj-preview';
import { JcdProject } from '../lib/models/jcd/jcd-project';

const default_env_id = '1';

const _fc = FetchClient.init();

export const jcdService = {
  default_env_id: default_env_id,

  getProjectPreviews: getProjectPreviews,
  getProjectPreviewByRoute: getProjectPreviewByRoute,
  getProjects: getProjects,
  getProjectByRoute: getProjectByRoute,
  getNamespaces: getNamespaces,
  getKinds: getKinds,
  getKindEntityKeys: getKindEntityKeys,
  getKindEntityByName: getKindEntityByName,
  postCopyEnvEntity: postCopyEnvEntity,

  getProjKeys,
  postCopyProj,
  deleteProjV3,
} as const;

async function getProjectPreviews(env: string): Promise<JcdProjPreview[]> {
  // let _env = env === undefined ? default_env_id : env;
  let usp = new URLSearchParams({ preview: 'true', env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawRespBody = await resp.json();
  if(!Array.isArray(rawRespBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let jcdProjPreviewsResp = rawRespBody.map((rawProjPreview) => {
    return JcdProjPreview.decode(rawProjPreview);
  });
  return jcdProjPreviewsResp;
}
async function getProjectPreviewByRoute(route: string, env: string): Promise<JcdProjPreview> {
  let usp = new URLSearchParams({
    preview: 'true',
    route: route,
    env: env,
  });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project?${usp.toString()}`;
  let resp = await _fc.get(url);
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawRespBody = await resp.json();
  let projPreview = JcdProjPreview.decode(rawRespBody);
  return projPreview;
}

async function getProjects(): Promise<JcdProjPreview[]> {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project`;
  let resp = await _fc.get(url);
  let rawRespBody = await resp.json();
  if(!Array.isArray(rawRespBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let jcdProjectsResp = rawRespBody.map((rawProj) => {
    return JcdProjPreview.decode(rawProj);
  });
  return jcdProjectsResp;
}

async function getProjectByRoute(projectRoute: string, env: string): Promise<JcdProject> {
  let usp = new URLSearchParams({ route: projectRoute, env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project?${usp.toString()}`;
  let resp = await _fc.get(url);
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawBody = await resp.json();
  let jcdProj = JcdProject.decode(rawBody);
  return jcdProj;
}

async function getNamespaces(): Promise<GcpNamespace[]> {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/ns`;
  let resp = await _fc.get(url);
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let nss = rawBody.map((rawNs) =>  GcpNamespace.decode(rawNs));
  return nss;
}

async function getKinds(env: string): Promise<GcpKeyDto[]> {
  let usp = new URLSearchParams({ env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let jcdKinds: GcpKeyDto[] = rawBody.map(GcpKeyDto.decode);
  return jcdKinds;
}

async function getKindEntityKeys(kind: string, env: string): Promise<GcpKeyDto[]> {
  let usp = new URLSearchParams({ env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${kind}?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let entityKeys: GcpKeyDto[] = rawBody.map(GcpKeyDto.decode);
  return entityKeys;
}

async function getKindEntityByName(kind: string, name: string, env: string): Promise<unknown> {
  let usp = new URLSearchParams({ name: name, env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${kind}?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawBody = await resp.json() as unknown;
  return rawBody;
}

async function postCopyEnvEntity(opts: {
  fromEnv: string;
  toEnv: string;
  kind: string;
  name: string;
}) {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${opts.kind}/copy`;
  let body = {
    fromEnv: opts.fromEnv,
    toEnv: opts.toEnv,
    kind: opts.kind,
    name: opts.name,
  };
  let resp = await _fc.post(url, { body: body });
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawBody = await resp.json();
  return rawBody;
}

async function getProjKeys(env: string): Promise<JcdProjKeyDto[]> {
  let usp = new URLSearchParams({ env: env });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/proj?${usp.toString()}`;
  let resp = await _fc.get(url);
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  return rawBody.map(rawVal => JcdProjKeyDto.decode(rawVal));
}

type JcdPostCopyProjOpts = {
  projKey: string;
  fromEnv: string;
  toEnv: string;
} & {};
async function postCopyProj(opts: JcdPostCopyProjOpts): Promise<JcdEnvCopyResDto> {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/proj/${opts.projKey}/copy`;
  let body = {
    fromEnv: opts.fromEnv,
    toEnv: opts.toEnv,
  };
  let resp = await _fc.post(url, { body });
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawResp = await resp.json();
  let res = JcdEnvCopyResDto.decode(rawResp);
  return res;
}

type DeleteJcdProjV3Opts = {
  env?: string;
  deleteImages?: boolean;
} & {};
async function deleteProjV3(projKey: string, opts: DeleteJcdProjV3Opts = {}) {
  let usp = new URLSearchParams();
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/proj/${projKey}`;
  if(opts.env !== undefined) {
    usp.set('env', opts.env);
  }
  if(opts.deleteImages === true) {
    usp.set('img', 'true');
  }
  if(usp.size > 0) {
    url = `${url}?${usp.toString()}`;
  }
  let resp = await _fc.delete(url);
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
}
