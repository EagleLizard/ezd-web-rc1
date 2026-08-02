
import './jcd-page.css';
import { useEffect, useState } from 'react';

import { jcdService } from '../../../service/jcd-service';
import { JcdProjPreview } from '../../../lib/models/jcd/jcd-proj-preview';
import { JcdProjPreviewItem } from './jcd-proj-preview/jcd-proj-preview-item';
import { HorizSep } from '../../components/horiz-sep/horiz-sep';
import { JcdProject } from '../../../lib/models/jcd/jcd-project';
import { JcdProjPane } from './jcd-proj-pane/jcd-proj-pane';
import { useNavigate, useSearch } from '@tanstack/react-router';

type JcdPageSection = {
  slug: string;
  text: string
  title: string;
};
const jcd_page_sections: Record<string, JcdPageSection> = {
  projects: {
    slug: 'projects',
    text: 'projects',
    title: 'Projects',
  }
};
type JcdPageProps = {
  //
} & {};
export function JcdPage(props: JcdPageProps) {
  const [ projPreviews, setProjPreviews ] = useState<JcdProjPreview[]>();
  const [ selectedProjPreview, setSelectedProjPreview ] = useState<JcdProjPreview | undefined>();

  const [ selectedProj, setSelectedProj ] = useState<JcdProject | undefined>();

  const navigate = useNavigate({from: '/jcd/'});
  const searchParams = useSearch({from: '/jcd/'});

  const projPreviewItems = projPreviews?.filter(projPrev => {
    return projPrev.projectKey !== selectedProjPreview?.projectKey;
  });

  useEffect(() => {
    jcdService.getProjectPreviews().then((_projPreviews) => {
      setProjPreviews(_projPreviews);
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
    <div className="jcd-page">
      <h1>
        jcd
      </h1>
      <div className="jcd-page-nav">
        <div>projects</div>
        <HorizSep></HorizSep>
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
            <div className="jcd-proj-previews">
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
