
import './jcd-env-main.css';

import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { jcdService } from '../../../../service/jcd-service';
import { GcpKeyDto } from '../../../../lib/models/jcd/gcp-kind';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { HorizSep } from '../../../components/horiz-sep/horiz-sep';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { GcpNamespace } from '../../../../lib/models/jcd/gcd-namespace';
import { EzdModal } from '../../../components/ezd-modal/ezd-modal';
import { ResponseError } from '../../../../lib/models/error/response-error';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';

const default_env_id = '1';
const none_option_value = '__none';

type JcdEnvMain = {
  //
} & {};
export function JcdEnvMain(props: JcdEnvMain){
  let [ envs, setEnvs ] = useState<GcpNamespace[] | undefined>();
  let [ envKinds, setEnvKinds ] = useState<GcpKeyDto[] | undefined>();
  let [ kindEntityKeys, setKindEntityKeys ] = useState<GcpKeyDto[] | undefined>();

  let [ selectedEnv, setSelectedEnv ] = useState<GcpNamespace | undefined>();
  let [ selectedTargetEnv, setSelectedTargetEnv ] = useState<GcpNamespace | undefined>();
  let [ selectedEnvKind, setSelectedEnvKind ] = useState<GcpKeyDto | undefined>();
  let [ selectedEntity, setSelectedEntity ] = useState<GcpKeyDto | undefined>();
  let [ entityPreview, setEntityPreview ] = useState<unknown>();

  let [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);

  let [ errorMsg, setErrorMsg ] = useState<string | undefined>();

  const navigate = useNavigate({ from: '/jcd/ns/' });
  const searchParams = useSearch({ from: '/jcd/ns/' });

  const srcEnvMatchesTargetEnv = (
    (selectedEnv === undefined && selectedTargetEnv?.id === default_env_id)
    || (selectedEnv?.name === selectedTargetEnv?.name)
  );
  const copyEnabled = (
    selectedTargetEnv !== undefined
    && selectedEnvKind !== undefined
    && selectedEntity !== undefined
    && !srcEnvMatchesTargetEnv
  );

  useEffect(() => {
    jcdService.getNamespaces().then(nss => {
      setEnvs(nss);
    });
  }, []);
  useEffect(() => {
    if(envs !== undefined && (
      selectedEnv === undefined
      || (selectedEnv.id !== default_env_id && searchParams.env !== selectedEnv.name)
      || (selectedEnv.id === default_env_id && searchParams.env !== undefined)
    )) {
      let foundEnv: GcpNamespace | undefined;
      if(searchParams.env === undefined) {
        foundEnv = envs.find(env => env.id === default_env_id);
      } else {
        foundEnv = envs.find(env => env.name === searchParams.env);
      }
      setSelectedEnv(foundEnv);
    }
    if(envs !== undefined && (
      (searchParams.toenv === default_env_id && (
        searchParams.toenv !== selectedTargetEnv?.id
      )) || (
        searchParams.toenv !== selectedTargetEnv?.name
      )
    )) {
      let foundTargetEnv = envs.find(env => {
        if(env.id === default_env_id) {
          return env.id === searchParams.toenv;
        }
        return env.name === searchParams.toenv;
      });
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
    let env = selectedEnv.id === default_env_id
      ? undefined
      : selectedEnv.name
    ;
    jcdService.getKinds(env).then((jcdKinds) => {
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
    jcdService.getKindEntityKeys(selectedEnvKind.name).then(entityKeys => {
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
    <div className="jcd-env-main">
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
      <div className="copy-select-group">
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
                  selected={selectedEnv?.name === env.name}
                  key={env.name}
                  value={env.id === default_env_id ? env.id : env.name}
                >
                  {env.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="ezd-select copy-to-selector">
          <div className="label">target env:</div>
          <select onChange={handleTargetEnvSelect}>
            <option
              selected={selectedTargetEnv === undefined}
              value={none_option_value}
            >
              -- none --
            </option>
            {envs?.map(env => {
              return (
                <option
                  selected={selectedTargetEnv?.name === env.name}
                  key={env.name}
                  value={env.id === default_env_id ? env.id : env.name}
                >
                  {env.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="ezd-select kind-selector">
        <div className="select-label">
          kind:
        </div>
        <select disabled={envKinds === undefined} onChange={handleKindSelect}>
          <option selected={selectedEnvKind === undefined} value={none_option_value}>-- none --</option>
          {envKinds?.map((envKind) => {
            return (
              <option selected={selectedEnvKind?.name === envKind.name} key={envKind.name} value={envKind.name}>
                {envKind.name}
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
          disabled={selectedEnvKind === undefined}
        >
          <option selected={selectedEntity === undefined} value={none_option_value}>-- none --</option>
          {kindEntityKeys?.map(entityKey => {
            return (
              <option selected={selectedEntity?.name === entityKey.name} key={entityKey.name} value={entityKey.name}>
                {entityKey.name}
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
        className="jcd-env-confirm-copy-modal"
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
    let val = ($e.target.value === none_option_value)
      ? undefined
      : $e.target.value
    ;
    if(val === default_env_id) {
      /* default env is the same as no query param _*/
      val = undefined;
    }
    setNavQs({
      env: val,
      ekind: undefined,
      ename: undefined,
    });
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
  function handleKindSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = $e.target.value === none_option_value ? undefined : $e.target.value;
    setNavQs({
      ekind: val ,
      ename: undefined,
    });
  }
  function handleEntitySelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = $e.target.value === none_option_value ? undefined : $e.target.value;
    setNavQs({ ename: val });
  }

  function handleCopyBtnClick($e: MouseEvent<HTMLButtonElement>) {
    if(selectedTargetEnv?.id === default_env_id) {
      setShowCopyModal(true);
    }
    setShowCopyModal(true);
  }
  function handleCopyModalConfirm() {
    if(!copyEnabled) {
      /* Should be an invalid state _*/
      return;
    }
    let fromEnv = selectedEnv?.id === default_env_id
      ? undefined
      : selectedEnv?.name
    ;
    let toEnv = selectedTargetEnv.id === default_env_id
      ? selectedTargetEnv.id
      : selectedTargetEnv.name
    ;
    let copyOpts: Parameters<typeof jcdService.postCopyEnvEntity>[0] = {
      fromEnv: fromEnv,
      toEnv: toEnv,
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
