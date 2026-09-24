
import './jcd-project-page.css';
import { useEffect, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';

import { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';
import { config } from '../../../../lib/config';
import { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import { jcdUtil } from '../../../../service/jcd-util';
import { ResponseError } from '../../../../lib/models/error/response-error';

type JcdProjectPageProps = {
  projectRoute: string;
} & {};
export function JcdProjectPage(props: JcdProjectPageProps) {
  const [ jcdProj, setJcdProj ] = useState<JcdProject | undefined>();
  const [ jcdProjPreview, setJcdProjPreview ] = useState<JcdProjPreview | undefined>();

  const [ fetchProjErr, setFetchProjErr ] = useState<string | undefined>();

  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img/${jcdProjPreview?.titleUri}?width=100`;

  const searchParams = useSearch({ from: '/jcd/proj/$project' });

  useEffect(() => {
    let projPromise = jcdService.getProjectByRoute(props.projectRoute, searchParams.env).then((_jcdProj) => {
      setJcdProj(_jcdProj);
    });
    let projPrevPromise = jcdService.getProjectPreviewByRoute(props.projectRoute, searchParams.env).then((_jcdProjPreview) => {
      setJcdProjPreview(_jcdProjPreview);
    });
    Promise.all([ projPromise, projPrevPromise ]).catch(e => {
      if(!ResponseError.is(e)) {
        throw e;
      }
      let errMsg: string;
      if(e.resp.status === 404) {
        errMsg = `404: Project '${props.projectRoute}' in env '${searchParams.env}' not found`;
      } else {
        errMsg = `Error fetching project '${props.projectRoute} in env '${searchParams.env}', status: ${e.resp.status}`;
      }
      setFetchProjErr(errMsg);
    });
  }, [ props.projectRoute ]);

  return (
    <div className="jcd-project-page">
      <div className="proj-backlink">
        <Link to="/jcd/proj" search={(prev) => ({...prev})}>{'<'} Back to projects</Link>
      </div>
      <h2 className="env">
        <span>env: </span>
        <span>{searchParams.env}</span>
      </h2>
      {fetchProjErr && (
        <div className="fetch-proj-err">
          <div className="error-heading">Error:</div>
          <div className="error-text">{fetchProjErr}</div>
        </div>
      )}
      {jcdProj && jcdProjPreview && (
        <>
          <div>
            <img src={titleImgUrl}/>
          </div>
          <h1>
            {jcdProjPreview.title}
          </h1>
          {jcdProj && (
            <div className="content">
              <div className="info">
                {jcdProj.venue}
              </div>
              <div className="info">
                {jcdUtil.getDisplayDate(jcdProj.month)} {jcdProj.year}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
