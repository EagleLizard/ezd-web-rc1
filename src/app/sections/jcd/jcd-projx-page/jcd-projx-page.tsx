
import './jcd-projx-page.css';

import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import type { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import type { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';

import { JcdProjPreviewItem } from '../jcd-proj-preview/jcd-proj-preview-item';
import { JcdProjPane } from '../jcd-proj-pane/jcd-proj-pane';
import { GcpNamespace } from '../../../../lib/models/jcd/gcd-namespace';
import { EzdSelect } from '../../../components/ezd-select/ezd-select';
import { JcdEnv } from '../../../../lib/models/jcd/jcd-env';

const none_option = {
  value: '__none',
  label: '-- none --',
} as const;

type JcdProjxPageProps = {
  //
} & {};
export function JcdProjxPage(props: JcdProjxPageProps) {
  const [ projPreviews, setProjPreviews ] = useState<JcdProjPreview[]>();
  const [ envs, setEnvs ] = useState<JcdEnv[] | undefined>();

  const [ selectedProjPreview, setSelectedProjPreview ] = useState<JcdProjPreview | undefined>();
  const [ selectedProj, setSelectedProj ] = useState<JcdProject | undefined>();
  const [ selectedEnv, setSelectedEnv ] = useState<JcdEnv | undefined>();

  const navigate = useNavigate({from: '/jcd/proj/'});
  const searchParams = useSearch({from: '/jcd/proj/'});

  const projPreviewItems = projPreviews?.filter(projPrev => {
    return projPrev.projectKey !== selectedProjPreview?.projectKey;
  });

  const envSelectItems = [
    ...(envs?.map(env => ({ value: env.key, label: env.name })) ?? [])
  ];

  useEffect(() => {
    jcdService.getNamespaces().then((nss) => {
      setEnvs(nss.map(JcdEnv.fromGcpNamespace));
    });
  }, []);
  useEffect(() => {
    if(selectedEnv === undefined) {
      return;
    }
    let envKey = selectedEnv?.isDefault ? undefined : selectedEnv?.key;
    setProjPreviews(undefined);
    jcdService.getProjectPreviews(envKey).then((_projPreviews) => {
      setProjPreviews(_projPreviews);
    });
  }, [ selectedEnv ]);

  useEffect(() => {
    let foundProjPrev = projPreviews?.find(projPrev => projPrev.projectKey === searchParams.proj);
    setSelectedProjPreview(foundProjPrev);
    setSelectedProj(undefined);
  }, [ searchParams.proj, projPreviews ]);
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
    setSelectedEnv(foundEnv);
  }, [ searchParams.env, envs ]);

  useEffect(() => {
    if(selectedProjPreview === undefined) {
      // cleanup, return
      setSelectedProj(undefined);
      return;
    }
    jcdService.getProjectByRoute(selectedProjPreview.route).then((jcdProj) => {
      setSelectedProj(jcdProj);
    });
  }, [ selectedProjPreview ]);

  return (
    <div className="jcd-projx-page">
      <div className="tools">
        <div className="env-selector">
          <div className="label">Env: </div>
          <EzdSelect
            data={envSelectItems}
            value={selectedEnv?.key ?? none_option.value}
            onChange={handleEnvSelect}
          />
        </div>
      </div>
      <div className="proj-list-view">
        <div className="proj-list-pane">
          {selectedProjPreview !== undefined && (
            <div className="selected-proj-preview">
              <JcdProjPreviewItem
                projPreview={selectedProjPreview}
                selected={true}
                onToggleClick={handleProjPaneClose}
              />
            </div>
          )}
          <div className="proj-list">
            <div className="jcd-proj-previews grid">
              {projPreviewItems && projPreviewItems.map((projPrev) => (
                <JcdProjPreviewItem
                  key={projPrev.projectKey}
                  projPreview={projPrev}
                  onToggleClick={() => {
                    handleProjPrevToggleClick(projPrev);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {selectedProjPreview && (
          <div className="proj-pane">
            <JcdProjPane
              jcdProjPreview={selectedProjPreview}
              jcdProject={selectedProj}
              onClose={handleProjPaneClose}
            />
          </div>
        )}
      </div>
    </div>
  );
  function handleProjPrevToggleClick(projPrev: JcdProjPreview) {
    setNavQs({ proj: projPrev.projectKey });
  }
  function handleProjPaneClose() {
    navigate(({search: (prev) => ({...prev, proj: undefined})}));
  }
  function handleEnvSelect($e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    let val = ($e.target.value === jcdService.default_env_id)
      ? undefined
      : $e.target.value
    ;
    setNavQs({ env: val });
  }
  function setNavQs(params: typeof searchParams = {}) {
    navigate({
      search: (prev) => ({ ...prev, ...params }),
    });
  }
}
