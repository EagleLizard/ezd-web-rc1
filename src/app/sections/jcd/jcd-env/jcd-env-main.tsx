
import './jcd-env-main.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { JcdProjKeyDto } from '../../../../lib/models/jcd/jcd-proj-key-dto';
import { jcdService } from '../../../../service/jcd-service';
import { EzdSelect, EzdSelectBasicItem } from '../../../components/ezd-select/ezd-select';
import { EzdCombobox } from '../../../components/ezd-combobox/ezd-combobox';
import { JcdEnv } from '../../../../lib/models/jcd/jcd-env';

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

  let [ srcEnv, setSrcEnv ] = useState<JcdEnv|undefined>();
  let [ selectedProjKey, setSelectedProjKey ] = useState<JcdProjKeyDto | undefined>();

  const navigate = useNavigate({ from: '/jcd/env/' });
  const searchParams = useSearch({ from: '/jcd/env/' });

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
  let srcEnvKey = (srcEnv?.isDefault)
    ? undefined
    : srcEnv?.key
  ;
  const destEnv = destEnvs.find(env => env.key === searchParams.toenv);

  useEffect(() => {
    jcdService.getNamespaces().then(nss => {
      setEnvs(nss.map(JcdEnv.fromGcpNamespace));
    });
  }, []);
  useEffect(() => {
    if(envs === undefined) {
      return;
    }
    let foundEnv = envs.find(env => {
      if(searchParams.env === undefined) {
        return env.isDefault;
      }
      return env.key === searchParams.env;
    });
    if(foundEnv?.key !== undefined && foundEnv?.key === srcEnv?.key) {
      return;
    }
    setSrcEnv(foundEnv);
  }, [ searchParams.env, envs ]);
  useEffect(() => {
    setSelectedProjKey(undefined);
    setProjKeys(undefined);
    jcdService.getProjKeys(srcEnvKey).then((projKeys) => {
      setProjKeys(projKeys);
    });
  }, [ srcEnv ]);
  useEffect(() => {
    if(searchParams.proj === selectedProjKey?.projectKey) {
      return;
    }
    let foundProjKey = projKeys?.find(projKey => projKey.projectKey === searchParams.proj);
    setSelectedProjKey(foundProjKey);
  }, [ searchParams.proj, projKeys ]);

  return (
    <div className="jcd-env-main">
      <div className="heading">jcd env main</div>
      <div className="content">
        <div className="source-selector">
          <div className="source-select env-selector">
            <div className="select-label">source env:</div>
            <EzdSelect
              data={srcEnvSelectItems}
              value={srcEnv?.key ?? none_option.value}
              onChange={handleEnvSelect}
            />
          </div>
          <div className="source-select proj-key-selector">
            <EzdCombobox
              placeholder={none_option.label}
              label="Proj Key"
              items={projKeys?.map(projKey => projKey.projectKey)}
              disabled={projKeys === undefined}
              value={selectedProjKey?.projectKey}
              onChange={handleProjKeySelect}
            />
          </div>
          <div className="source-select dest-env-selector">
            <div className="select-label">target env:</div>
            <EzdSelect
              data={destEnvSelectItems}
              disabled={envs === undefined}
              value={destEnv?.key ?? none_option.value}
              onChange={handleDestEnvSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
  function handleEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === none_option.value || $e.target.value === jcdService.default_env_id)
      ? undefined
      : $e.target.value
    ;
    setNavQs({
      env: val,
    });
  }
  function handleProjKeySelect(val?: string) {
    console.log(val);
    setNavQs({
      proj: val,
    });
  }
  function handleDestEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let toenvVal = ($e.target.validationMessage === none_option.value)
      ? undefined
      : $e.target.value
    ;
    setNavQs({
      toenv: toenvVal,
    });
  }
  function setNavQs(opts: typeof searchParams = {}) {
    navigate({
      replace: true,
      search: (prev) => ({ ...prev, ...opts }),
    });
  }
}
