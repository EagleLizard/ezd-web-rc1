
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
import { JcdImage } from '../../../../lib/models/jcd/jcd-image';
import { EzdModal } from '../../../components/ezd-modal/ezd-modal';
import { prim } from '../../../../lib/util/validate-primitives';

type JcdProjectPageProps = {
  projectRoute: string;
} & {};
export function JcdProjectPage(props: JcdProjectPageProps) {
  const [ jcdProj, setJcdProj ] = useState<JcdProject | undefined>();
  const [ jcdProjPreview, setJcdProjPreview ] = useState<JcdProjPreview | undefined>();
  const [ projImgs, setProjImgs ] = useState<JcdImage[] | undefined>();
  const [ titleImgToUpload, setTitleImgToUpload ] = useState<File | undefined>(undefined);

  const [ titleImgToggle, setTitleImgToggle ] = useState<boolean>(false);
  const [ selectedImageToDelete, setSelectedImageToDelete ] = useState<JcdImage | undefined>();

  const [ fetchProjErr, setFetchProjErr ] = useState<string | undefined>();
  const [ deleteImgPending, setDeleteImgPending ] = useState<boolean>(false);
  const [ deleteImgModalErr, setDeleteImgModalErr ] = useState<string | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img-proxy/${jcdProjPreview?.titleUri}?width=100`;

  const searchParams = useSearch({ from: '/jcd/proj/$project' });

  const _env = searchParams.env ?? jcdService.default_env_id;

  useEffect(() => {
    let projPromise = jcdService.getProjectByRoute(props.projectRoute, _env)
      .then((_jcdProj) => {
        setJcdProj(_jcdProj);
        return fetchProjImgs(_jcdProj.projectKey);
      });
    let projPrevPromise = jcdService.getProjectPreviewByRoute(props.projectRoute, _env).then((_jcdProjPreview) => {
      setJcdProjPreview(_jcdProjPreview);
    });
    Promise.all([ projPromise, projPrevPromise ]).catch(e => {
      if(!ResponseError.is(e)) {
        throw e;
      }
      let errMsg: string;
      if(e.resp.status === 404) {
        errMsg = `404: Project '${props.projectRoute}' in env '${_env}' not found`;
      } else {
        errMsg = `Error fetching project '${props.projectRoute} in env '${_env}', status: ${e.resp.status}`;
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
        <span>{_env}</span>
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
                  multiple
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
                  <EzdButton className="file-upload-btn" onClick={() => {
                    if(_env === undefined) {
                      return;
                    }
                    let formData = new FormData();
                    formData.append('myFile', titleImgToUpload);
                    let imageType = titleImgToggle ? 'TITLE' as const : 'GALLERY' as const;
                    jcdService.postUploadProjImg(jcdProj.projectKey, {
                      env: _env,
                      fileData: formData,
                      imageType,
                    }).then(() => {
                      console.log(formData);
                    });
                  }}>upload</EzdButton>
                  <div className="checkbox">
                    <input
                      id="title-img-checkbox"
                      type="checkbox"
                      checked={titleImgToggle}
                      onChange={($e) => {
                        setTitleImgToggle($e.target.checked);
                      }}
                    />
                    <label htmlFor="title-img-checkbox">title</label>
                  </div>
                </div>
              )}
            </div>
            <div className="proj-imgs">
              {projImgs?.map(projImg => (
                <div
                  className="proj-img-tile"
                  key={projImg.id}
                >
                  <div className="img-container">
                    <img src={`${config.EZD_API_BASE_URL}/v1/jcd/img/${projImg.bucketFile}?env=${_env}&sz=xxs`}/>
                  </div>
                  <div className="del-btn">
                    <EzdIconButton
                      className="trash-icon-btn"
                      onClick={() => setSelectedImageToDelete(projImg) }
                    >
                      delete
                    </EzdIconButton>
                  </div>
                </div>
              ))}
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
      {selectedImageToDelete !== undefined && (
        <EzdModal
          show={true}
          onClose={handleDeleteImageModalClose}
          className="jcd-img-delete-modal">
          <div>
            <h3>Are you sure?</h3>
            <div>
              {'You\'re about to delete the following image:'}
            </div>
            <div>
              <div>
                <img src={jcdUtil.getImageUrl(_env, selectedImageToDelete, 'xxs')}/>
              </div>
              <code>
                {selectedImageToDelete.id}
              </code>
            </div>
            {deleteImgModalErr && (
              <div className="delete-image-error">
                <span>Error: </span>
                <span>{deleteImgModalErr}</span>
              </div>
            )}
            <div className="ezd-modal-actions">
              <EzdButton onClick={closeDeleteImageModal}>
                Cancel
              </EzdButton>
              <EzdButton
                color="delete"
                disabled={deleteImgPending}
                onClick={() => {
                  if(jcdProj === undefined || selectedImageToDelete === undefined) {
                    return;
                  }
                  handleDeleteImageConfirm(jcdProj.projectKey, selectedImageToDelete.id)
                    .then(() => {
                      closeDeleteImageModal();
                      return fetchProjImgs(jcdProj.projectKey);
                    });
                }}
              >
                Delete
              </EzdButton>
            </div>
          </div>
        </EzdModal>
      )}
    </div>
  );
  function fetchProjImgs(projKey: string): Promise<JcdImage[]> {
    return jcdService.getProjImgs(_env, projKey).then(_projImgs => {
      setProjImgs(_projImgs);
      return _projImgs;
    });
  }
  function closeDeleteImageModal() {
    setSelectedImageToDelete(undefined);
    setDeleteImgModalErr(undefined);
  }
  function handleDeleteImageModalClose() {
    closeDeleteImageModal();
  }
  function handleDeleteImageConfirm(projKey: string, imgKey: string): Promise<void> {
    setDeleteImgPending(true);
    return jcdService.deleteProjImg(_env, projKey, imgKey).catch(err => {
      if(ResponseError.is(err)) {
        return err.resp.json().then(rawBody => {
          if(prim.isString(rawBody.errMsg)) {
            setDeleteImgModalErr(rawBody.errMsg);
            return;
          }
          console.error(rawBody);
          setDeleteImgModalErr(`An unexpected error occured with status: ${err.resp}`);
        });
      }
      throw err;
    }).finally(() => {
      setDeleteImgPending(false);
    });
  }
}
