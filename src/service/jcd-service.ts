
import { FetchClient } from '../lib/client/fetch-client';
import { config } from '../lib/config';
import { EzdError } from '../lib/models/error/ezd-error';
import { ResponseError } from '../lib/models/error/response-error';
import { GcpNamespace } from '../lib/models/jcd/gcd-namespace';
import { GcpKeyDto } from '../lib/models/jcd/gcp-key-dto';
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
} as const;

async function getProjectPreviews(): Promise<JcdProjPreview[]> {
  let usp = new URLSearchParams({
    preview: 'true',
  });
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
async function getProjectPreviewByRoute(route: string): Promise<JcdProjPreview> {
  let usp = new URLSearchParams({
    preview: 'true',
    route: route,
  });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project?${usp.toString()}`;
  let resp = await _fc.get(url);
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

async function getProjectByRoute(projectRoute: string): Promise<JcdProject> {
  let usp = new URLSearchParams({
    route: projectRoute,
  });
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/project?${usp.toString()}`;
  let resp = await _fc.get(url);
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
  let nss = rawBody.map((rawNs) => {
    return GcpNamespace.decode(rawNs);
  });
  return nss;
}

async function getKinds(ns?: string): Promise<GcpKeyDto[]> {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind`;
  if(ns !== undefined) {
    let usp = new URLSearchParams({
      ns: ns,
    });
    url = `${url}?${usp.toString()}`;
  }
  let resp = await _fc.get(url);
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let jcdKinds: GcpKeyDto[] = rawBody.map(GcpKeyDto.decode);
  return jcdKinds;
}

async function getKindEntityKeys(kind: string, ns?: string): Promise<GcpKeyDto[]> {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${kind}`;
  if(ns !== undefined) {
    let usp = new URLSearchParams({
      ns: ns,
    });
    url = `${url}?${usp.toString()}`;
  }
  let resp = await _fc.get(url);
  let rawBody = await resp.json();
  if(!Array.isArray(rawBody)) {
    throw new EzdError('Invalid response type, expected array', 'EZDW_2.1');
  }
  let entityKeys: GcpKeyDto[] = rawBody.map(GcpKeyDto.decode);
  return entityKeys;
}

async function getKindEntityByName(kind: string, name: string, ns?: string): Promise<unknown> {
  let usp = new URLSearchParams({
    name: name,
  });
  if(ns !== undefined) {
    usp.append('ns', ns);
  }
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${kind}?${usp.toString()}`;
  let resp = await _fc.get(url);
  let rawBody = await resp.json() as unknown;
  return rawBody;
}

async function postCopyEnvEntity(opts: {
  fromEnv?: string;
  toEnv: string;
  kind: string;
  name: string;
}) {
  let url = `${config.EZD_API_BASE_URL}/v1/jcd/env/kind/${opts.kind}/copy`;
  let body = {
    toEnv: opts.toEnv,
    kind: opts.kind,
    name: opts.name,
  };
  let resp = await _fc.post(url, {
    body: body,
  });
  if(resp.status !== 200) {
    throw new ResponseError(resp);
  }
  let rawBody = await resp.json();
  return rawBody;
}
