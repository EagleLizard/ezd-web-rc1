
import './jcd-env-main.css';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { JcdProjKeyDto } from '../../../../lib/models/jcd/jcd-proj-key-dto';
import { jcdService } from '../../../../service/jcd-service';
import { EzdSelect, EzdSelectBasicItem } from '../../../components/ezd-select/ezd-select';
import { EzdCombobox } from '../../../components/ezd-combobox/ezd-combobox';
import { JcdEnv } from '../../../../lib/models/jcd/jcd-env';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { EzdModal } from '../../../components/ezd-modal/ezd-modal';
import { JcdEnvCopyResDto } from '../../../../lib/models/jcd/jcd-env-copy-res-dto';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';
import { EzdInput } from '../../../components/ezd-input/ezd-input';

const none_option = {
  value: '__none',
  label: '-- none --',
} as const;
const new_env_option = {
  value: '__newenv__',
  label: 'New Env *',
} as const satisfies EzdSelectBasicItem;

type JcdEnvMainProps = {
  //
} & {};
export function JcdEnvMain(props: JcdEnvMainProps) {
  let [ projKeys, setProjKeys ] = useState<JcdProjKeyDto[] | undefined>();
  let [ envs, setEnvs ] = useState<JcdEnv[] | undefined>();

  let [ copyRes, setCopyRes ] = useState<JcdEnvCopyResDto | undefined>();
  let [ newEnvName, setNewEnvName ] = useState<string | undefined>();

  const [ showOpModal, setShowOpModal ] = useState(false);

  const navigate = useNavigate({ from: '/jcd/env/' });
  const searchParams = useSearch({ from: '/jcd/env/' });

  const srcEnv = useMemo(() => {
    return envs?.find(env => {
      if(searchParams.env === undefined) {
        return env.isDefault;
      }
      return env.key === searchParams.env;
    });
  }, [ envs, searchParams.env ]);
  const selectedProjKey = useMemo(() => {
    return projKeys?.find(projKey => projKey.projectKey === searchParams.proj);
  }, [ projKeys, searchParams.proj ]);

  const srcEnvSelectItems: EzdSelectBasicItem[] = [
    {...none_option},
    ...(envs?.map(env => ({ value: env.key, label: env.name,})) ?? [])
  ];
  const destEnvs = [
    ...(envs ?? []),
    JcdEnv.init(new_env_option.value, new_env_option.label)
  ];
  const destEnvSelectItems: EzdSelectBasicItem[] = [
    {...none_option},
    ...(destEnvs.map(env => ({ value: env.key, label: env.name,})) ?? []),
  ];
  const destEnv = destEnvs.find(env => env.key === searchParams.toenv);

  const copyEnabled = (
    srcEnv !== undefined
    && destEnv !== undefined
    && selectedProjKey !== undefined
    && srcEnv.key !== destEnv.key
    && (
      (destEnv.key === new_env_option.value)
        ? newEnvName && newEnvName.length > 0
        : true
    )
  );
  const deleteEnabled = (
    srcEnv !== undefined
    && destEnv === undefined
    && selectedProjKey !== undefined
  );

  useEffect(() => {
    fetchEnvs();
  }, []);
  useEffect(() => {
    if(srcEnv === undefined) {
      return;
    }
    setProjKeys(undefined);
    jcdService.getProjKeys(srcEnv.key).then((projKeys) => {
      setProjKeys(projKeys);
    });
  }, [ srcEnv ]);

  return (
    <div className="jcd-env-main">
      <div className="heading">jcd env main</div>
      <div className="content">
        <div className="source-selector">
          <div className="proj-select env-selector">
            <div className="select-label">source env:</div>
            <EzdSelect
              data={srcEnvSelectItems}
              value={srcEnv?.key ?? none_option.value}
              onChange={handleEnvSelect}
            />
          </div>
          <div className="proj-select proj-key-selector">
            <EzdCombobox
              placeholder={none_option.label}
              label="Proj Key"
              items={projKeys?.map(projKey => projKey.projectKey)}
              disabled={projKeys === undefined}
              value={selectedProjKey?.projectKey}
              onChange={handleProjKeySelect}
            />
          </div>
        </div>
        <div className="dest-selector">
          <div className="proj-select dest-env-selector">
            <div className="select-label">target env:</div>
            <EzdSelect
              data={destEnvSelectItems}
              disabled={envs === undefined}
              value={destEnv?.key ?? none_option.value}
              onChange={handleDestEnvSelect}
            />
          </div>
          {destEnv?.key === new_env_option.value && (
            <div className="new-env">
              <EzdInput
                label="New env:"
                value={newEnvName}
                invalid={newEnvName !== undefined && newEnvName.length < 1}
                onChange={($e) => {
                  setNewEnvName($e.target.value);
                }}
              />
            </div>
          )}
        </div>
        <div className="action-group">
          <EzdButton
            className="env-op-btn"
            disabled={!copyEnabled}
            onClick={handleCopyClick}
          >
            Copy
          </EzdButton>
          <EzdButton
            className="env-op-btn"
            disabled={!deleteEnabled}
            onClick={handleDeleteClick}
          >
            Delete
          </EzdButton>
        </div>
      </div>
      {copyRes && (
        <div className="copy-results">
          <EzdIconButton onClick={() => {
            setCopyRes(undefined);
          }}>X</EzdIconButton>
          <div>Copy result:</div>
          <div>
            inserted: {copyRes.ops.inserted.length}, skipped: {copyRes.ops.skipped.length}
          </div>
        </div>
      )}
      <EzdModal
        className="env-op-modal"
        show={showOpModal}
        onClose={closeOpModal}
      >
        <div>
          oops
        </div>
      </EzdModal>
    </div>
  );

  function fetchEnvs() {
    return jcdService.getNamespaces().then(nss => {
      setEnvs(nss.map(JcdEnv.fromGcpNamespace));
    });
  }

  function closeOpModal() {
    setShowOpModal(false);
  }
  function handleDeleteClick() {
    if(selectedProjKey === undefined) {
      return;
    }
    jcdService.deleteProjV3(selectedProjKey.projectKey, {
      env: srcEnv?.key,
      deleteImages: true,
    }).then(() => {
      setNavQs({ proj: undefined });
      return fetchEnvs();
    }).catch(err => {
      console.error(err);
    });
  }
  function handleCopyClick() {
    /*
    show the confirm modal for dest target + default
    _*/
    if(destEnv?.isDefault) {
      setShowOpModal(true);
      return;
    }
    if(!copyEnabled) {
      return;
    }
    let fromEnv = srcEnv.key;
    let toEnv: string;
    if(destEnv.key === new_env_option.value) {
      if(newEnvName === undefined || newEnvName.length < 1) {
        /* should not be possible/reachable _*/
        return;
      }
      toEnv = newEnvName;
    } else {
      toEnv = destEnv.key;
    }
    setCopyRes(undefined);
    jcdService.postCopyProj({
      projKey: selectedProjKey.projectKey,
      fromEnv: fromEnv,
      toEnv: toEnv,
    }).then((res) => {
      setCopyRes(res);
      if(destEnv.key === new_env_option.value) {
        return fetchEnvs().then(() => {
          setNewEnvName(undefined);
          setNavQs({ toenv: toEnv  });
        });
      }
    }).catch(e => {
      console.error(e);
    });
  }

  function handleEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === none_option.value || $e.target.value === jcdService.default_env_id)
      ? undefined
      : $e.target.value
    ;
    setNavQs({ env: val });
  }
  function handleProjKeySelect(val?: string) {
    setNavQs({ proj: val });
  }
  function handleDestEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let toenvVal = ($e.target.value === none_option.value)
      ? undefined
      : $e.target.value
    ;
    setNavQs({ toenv: toenvVal });
  }
  function setNavQs(opts: typeof searchParams = {}) {
    navigate({
      replace: true,
      search: (prev) => ({ ...prev, ...opts }),
    });
  }
}
