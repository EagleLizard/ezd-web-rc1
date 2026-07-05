
import { FetchClient } from '../lib/client/fetch-client';
import { config } from '../lib/config';
import { EzdError } from '../lib/models/error/ezd-error';
import { JcdProjPreview } from '../lib/models/jcd/jcd-proj-preview';
import { JcdProject } from '../lib/models/jcd/jcd-project';

const _fc = FetchClient.init();

export const jcdService = {
  getProjectPreviews: getProjectPreviews,
  getProjectPreviewByRoute: getProjectPreviewByRoute,
  getProjects: getProjects,
  getProjectByRoute: getProjectByRoute,
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
