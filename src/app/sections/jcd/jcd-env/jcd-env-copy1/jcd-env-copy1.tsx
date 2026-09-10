
import './jcd-env-copy1.css';

import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { jcdService } from '../../../../../service/jcd-service';
import { GcpKeyDto } from '../../../../../lib/models/jcd/gcp-key-dto';
import { EzdButton } from '../../../../components/ezd-button/ezd-button';
import { HorizSep } from '../../../../components/horiz-sep/horiz-sep';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EzdModal } from '../../../../components/ezd-modal/ezd-modal';
import { ResponseError } from '../../../../../lib/models/error/response-error';
import { EzdIconButton } from '../../../../components/ezd-icon-button/ezd-icon-button';
import { JcdEnv } from '../../../../../lib/models/jcd/jcd-env';

const none_option_value = '__none';

type JcdEnvCopy1Props = {
  //
} & {};
export function JcdEnvCopy1(props: JcdEnvCopy1Props){
  let [ envs, setEnvs ] = useState<JcdEnv[] | undefined>();
  let [ envKinds, setEnvKinds ] = useState<GcpKeyDto[] | undefined>();
  let [ kindEntityKeys, setKindEntityKeys ] = useState<GcpKeyDto[] | undefined>();

  let [ selectedEnv, setSelectedEnv ] = useState<JcdEnv | undefined>();
  let [ selectedTargetEnv, setSelectedTargetEnv ] = useState<JcdEnv | undefined>();
  let [ selectedEnvKind, setSelectedEnvKind ] = useState<GcpKeyDto | undefined>();
  let [ selectedEntity, setSelectedEntity ] = useState<GcpKeyDto | undefined>();
  let [ entityPreview, setEntityPreview ] = useState<unknown>();

  let [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);

  let [ errorMsg, setErrorMsg ] = useState<string | undefined>();

  const navigate = useNavigate({ from: '/jcd/env/copy1' });
  const searchParams = useSearch({ from: '/jcd/env/copy1' });

  const srcEnvMatchesTargetEnv = (
    (selectedEnv === undefined && selectedTargetEnv?.isDefault)
    || (selectedEnv?.key === selectedTargetEnv?.key)
  );
  const copyEnabled = (
    selectedTargetEnv !== undefined
    && selectedEnvKind !== undefined
    && selectedEntity !== undefined
    && !srcEnvMatchesTargetEnv
  );
  const sourceEnvKey = (selectedEnv?.isDefault)
    ? undefined
    : selectedEnv?.key
  ;

  useEffect(() => {
    jcdService.getNamespaces().then(nss => {
      setEnvs(nss.map(ns => JcdEnv.fromGcpNamespace(ns)));
    });
  }, []);
  useEffect(() => {
    if(envs !== undefined && (
      selectedEnv === undefined
      || (selectedEnv.isDefault)
        ? searchParams.env !== undefined
        : searchParams.env !== selectedEnv.key
    )) {
      let foundEnv: JcdEnv | undefined;
      if(searchParams.env === undefined) {
        foundEnv = envs.find(env => env.isDefault);
      } else {
        foundEnv = envs.find(env => env.key === searchParams.env);
      }
      setSelectedEnv(foundEnv);
    }
    if(envs !== undefined && searchParams.toenv !== selectedTargetEnv?.key) {
      let foundTargetEnv = envs.find(env => env.key === searchParams.toenv);
      setSelectedTargetEnv(foundTargetEnv);
    }
    if(envKinds !== undefined && searchParams.ekind !== selectedEnvKind?.name) {
      let foundKind = envKinds.find((envKind) => envKind.name === searchParams.ekind);
      setSelectedEnvKind(foundKind);
    }
    if(kindEntityKeys !== undefined && searchParams.ename !== selectedEntity?.name) {
      let foundEntity = kindEntityKeys.find(entityKey => {
        return entityKey.name === searchParams.ename;
      });
      setSelectedEntity(foundEntity);
    }
  }, [ searchParams, envs, envKinds, kindEntityKeys ]);
  useEffect(() => {
    setSelectedEnvKind(undefined);
    setEnvKinds(undefined);
    if(selectedEnv === undefined) {
      return;
    }
    jcdService.getKinds(sourceEnvKey).then((jcdKinds) => {
      setEnvKinds(jcdKinds);
    });
  }, [ selectedEnv ]);
  useEffect(() => {
    setKindEntityKeys(undefined);
    setSelectedEntity(undefined);
    setEntityPreview(undefined);
    if(selectedEnvKind === undefined) {
      return;
    }
    jcdService.getKindEntityKeys(selectedEnvKind.name, sourceEnvKey).then(entityKeys => {
      setKindEntityKeys(entityKeys);
    });
  }, [ selectedEnvKind ]);
  useEffect(() => {
    setEntityPreview(undefined);
    if(selectedEntity === undefined) {
      return;
    }
  }, [ selectedEntity ]);

  return (
    <div className="jcd-env-copy1">
      <h1>jcd env</h1>
      <HorizSep/>
      <div className="op-selector">
        <h2>operation</h2>
        <EzdButton>copy entity</EzdButton>
      </div>
      <HorizSep/>
      {errorMsg && (
        <div className="ezd-error-msg">
          <EzdIconButton onClick={($e) => {
            setErrorMsg(undefined);
          }}>X</EzdIconButton>
          <div className="label">
            Error:
          </div>
          <div className="text">
            {errorMsg}
          </div>
        </div>
      )}
      <div className="source-selector">
        <div className="ezd-select env-selector">
          <div className="select-label">source env:</div>
          <select onChange={handleEnvSelect}>
            <option
              selected={selectedEnv === undefined}
              value={none_option_value}
            >
              -- none --
            </option>
            {envs?.map(env => {
              return (
                <option
                  selected={env.key === selectedEnv?.key}
                  key={env.key}
                  value={env.key}
                >
                  {env.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="ezd-select kind-selector">
          <div className="select-label">
            kind:
          </div>
          <select
            disabled={envKinds === undefined}
            onChange={handleKindSelect}
          >
            <option selected={selectedEnvKind === undefined} value={none_option_value}>
              -- none --
            </option>
            {envKinds?.map((kind) => {
              return (
                <option
                  selected={selectedEnvKind?.name === kind.name}
                  key={kind.name}
                  value={kind.name}
                >
                  {kind.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="ezd-select entity-selector">
          <div className="select-label">
            entity:
          </div>
          <select
            onChange={handleEntitySelect}
            disabled={kindEntityKeys === undefined}
          >
            <option selected={selectedEntity === undefined} value={none_option_value}>-- none --</option>
            {kindEntityKeys?.map(entityKey => {
              return (
                <option
                  selected={selectedEntity?.name === entityKey.name}
                  key={entityKey.name}
                  value={entityKey.name}
                >
                  {entityKey.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="ezd-select copy-to-selector">
        <div className="label">target env:</div>
        <select onChange={handleTargetEnvSelect}>
          <option selected={selectedTargetEnv === undefined} value={none_option_value}>-- none --</option>
          {envs?.map(env => {
            return (
              <option
                selected={selectedTargetEnv?.key === env.key}
                key={env.key}
                value={env.key}
              >
                {env.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="copy-button">
        <EzdButton
          disabled={!copyEnabled}
          onClick={handleCopyBtnClick}
        >
          Copy
        </EzdButton>
      </div>
      <div className="preview-button">
        <EzdButton
          disabled={!selectedEntity}
          onClick={handlePreviewClick}
        >
          Preview
        </EzdButton>
      </div>
      <div className="entity-preview">
        <div className="label">preivew:</div>
        <div className="preview-json">
          {entityPreview !== undefined && (
            <code><pre>{JSON.stringify(entityPreview, null, 2)}</pre></code>
          )}
        </div>
      </div>
      <EzdModal
        className="jcd-env-confirm-copy1-modal"
        show={showCopyModal}
        onClose={handleCopyModalClose}
      >
        <div className="modal-content">
          <h3>
            Are you sure?
          </h3>
          <div>
            <p>This will modify the <b>primary env</b>.</p>
            <p>Copy operations will overwrite entities in the target env.</p>
          </div>
          <div className="modal-actions">
            <EzdButton onClick={handleCopyModalCancel}>
              Cancel
            </EzdButton>
            <EzdButton onClick={handleCopyModalConfirm}>
              Confirm
            </EzdButton>
          </div>
        </div>
      </EzdModal>
    </div>
  );

  function handleEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === none_option_value || $e.target.value === jcdService.default_env_id)
      ? undefined
      : $e.target.value
    ;
    setNavQs({
      env: val,
      ekind: undefined,
      ename: undefined,
    });
  }
  function handleKindSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === none_option_value) ? undefined : $e.target.value;
    setNavQs({
      ekind: val,
      ename: undefined,
    });
  }
  function handleEntitySelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === none_option_value) ? undefined : $e.target.value;
    setNavQs({ ename: val });
  }
  function handleTargetEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let toenvVal = ($e.target.value === none_option_value)
      ? undefined
      : $e.target.value
    ;
    setNavQs({
      toenv: toenvVal,
    });
  }

  function handleCopyBtnClick($e: MouseEvent<HTMLButtonElement>) {
    if(selectedTargetEnv?.isDefault) {
      setShowCopyModal(true);
    }
    setShowCopyModal(true);
  }
  function handleCopyModalConfirm() {
    if(!copyEnabled) {
      /* Should be an invalid state _*/
      return;
    }
    let copyOpts: Parameters<typeof jcdService.postCopyEnvEntity>[0] = {
      fromEnv: sourceEnvKey,
      toEnv: selectedTargetEnv.key,
      kind: selectedEnvKind.name,
      name: selectedEntity.name,
    };
    jcdService.postCopyEnvEntity(copyOpts).then(res => {
      console.log(res);
    }).catch(err => {
      if(!(err instanceof ResponseError)) {
        throw err;
      }
      if(err.resp.status === 403) {
        return err.resp.json().then(rawBody => {
          if('errMsg' in rawBody) {
            setErrorMsg(rawBody.errMsg);
          } else {
            setErrorMsg('something went wrong');
          }
        });
      }
      return err.resp.json().then(rawBody => {
        if('message' in rawBody) {
          setErrorMsg(rawBody.message);
        } else {
          setErrorMsg(JSON.stringify(rawBody));
        }
      });
    }).finally(() => {
      setShowCopyModal(false);
    });
  }
  function handleCopyModalCancel() {
    setShowCopyModal(false);
  }
  function handleCopyModalClose() {
    setShowCopyModal(false);
  }

  function handlePreviewClick($e: MouseEvent<HTMLButtonElement>) {
    if(selectedEnvKind === undefined || selectedEntity === undefined) {
      return;
    }
    jcdService.getKindEntityByName(selectedEnvKind.name, selectedEntity.name).then((res) => {
      setEntityPreview(res);
    });
  }

  function setNavQs(opts: typeof searchParams = {}) {
    navigate({
      replace: true,
      search: (prev) => ({ ...prev, ...opts }),
    });
  }
}
