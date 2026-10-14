
import './jcd-project-page.css';
import { useEffect, useRef, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';

import { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';
import { config } from '../../../../lib/config';
import { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import { jcdUtil } from '../../../../service/jcd-util';
import { ResponseError } from '../../../../lib/models/error/response-error';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';

type JcdProjectPageProps = {
  projectRoute: string;
} & {};
export function JcdProjectPage(props: JcdProjectPageProps) {
  const [ jcdProj, setJcdProj ] = useState<JcdProject | undefined>();
  const [ jcdProjPreview, setJcdProjPreview ] = useState<JcdProjPreview | undefined>();
  const [ titleImgToUpload, setTitleImgToUpload ] = useState<File | undefined>(undefined);

  const [ fetchProjErr, setFetchProjErr ] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img-proxy/${jcdProjPreview?.titleUri}?width=100`;

  const searchParams = useSearch({ from: '/jcd/proj/$project' });

  useEffect(() => {
    if(searchParams.env === undefined) {
      return undefined;
    }
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
  }, [ props.projectRoute, searchParams.env ]);

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
          <div className="title-image-section">
            <img className="title-image" src={titleImgUrl}/>
            <div className="title-image-upload">
              <div className="file-select">
                <EzdButton
                  className="upload-btn"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  Select Image
                </EzdButton>
                <input
                  className="upload-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={($e) => {
                    setTitleImgToUpload($e.target.files?.item(0) ?? undefined);
                  }}
                />
                <div className="selected-image">
                  {titleImgToUpload?.name}
                </div>
                {titleImgToUpload && (
                  <EzdIconButton onClick={() => {
                    setTitleImgToUpload(undefined);
                  }}>X</EzdIconButton>
                )}
              </div>
              {titleImgToUpload && (
                <div className="file-upload">
                  <EzdButton className="file-upload-btn" onClick={($e) => {
                    if(searchParams.env === undefined) {
                      return;
                    }
                    let formData = new FormData();
                    formData.append('myFile', titleImgToUpload);
                    jcdService.postUploadProjImg(jcdProj.projectKey, {
                      env: searchParams.env,
                      fileData: formData,
                      imageType: 'TITLE',
                    }).then(() => {
                      console.log(formData);
                    });
                  }}>upload</EzdButton>
                </div>
              )}
            </div>
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
