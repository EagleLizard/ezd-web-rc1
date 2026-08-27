
import './jcd-projx-page.css';

import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import type { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import type { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';

import { JcdProjPreviewItem } from '../jcd-proj-preview/jcd-proj-preview-item';
import { JcdProjPane } from '../jcd-proj-pane/jcd-proj-pane';
import { GcpNamespace } from '../../../../lib/models/jcd/gcd-namespace';

type JcdProjxPageProps = {
  //
} & {};

export function JcdProjxPage(props: JcdProjxPageProps) {
  const [ projPreviews, setProjPreviews ] = useState<JcdProjPreview[]>();
  const [ nss, setNss ] = useState<GcpNamespace[]>();

  const [ selectedProjPreview, setSelectedProjPreview ] = useState<JcdProjPreview | undefined>();
  const [ selectedProj, setSelectedProj ] = useState<JcdProject | undefined>();

  const navigate = useNavigate({from: '/jcd/proj/'});
  const searchParams = useSearch({from: '/jcd/proj/'});

  const projPreviewItems = projPreviews?.filter(projPrev => {
    return projPrev.projectKey !== selectedProjPreview?.projectKey;
  });

  useEffect(() => {
    jcdService.getProjectPreviews().then((_projPreviews) => {
      setProjPreviews(_projPreviews);
    });
    jcdService.getNamespaces().then((_nss) => {
      setNss(_nss);
    });
  }, []);

  useEffect(() => {
    let foundPJrojPrev = projPreviews?.find(projPrev => projPrev.projectKey === searchParams.proj);
    setSelectedProjPreview(foundPJrojPrev);
    setSelectedProj(undefined);
  }, [ searchParams, projPreviews ]);

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
        <div className="namespace-selector">
          <div className="label">Namespace:</div>
          {nss !== undefined && (
            <select onChange={($e) => {
              console.log($e.target.value);
            }}>
              {nss.map((ns) => (
                <option
                  key={ns.name}
                  value={ns.name}
                >
                  {ns.name}
                </option>
              ))}
            </select>
          )}
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
    navigate({search: (prev) => ({...prev, proj: projPrev.projectKey}) });
  }
  function handleProjPaneClose() {
    navigate(({search: (prev) => ({...prev, proj: undefined})}));
  }
}
