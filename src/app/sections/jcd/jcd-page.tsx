
import './jcd-page.css';
import { useEffect, useState } from 'react';
import { jcdService } from '../../../service/jcd-service';
import { JcdProjPreview } from '../../../lib/models/jcd/jcd-proj-preview';
import { JcdProjPreviewItem } from './jcd-proj-preview/jcd-proj-preview-item';

type JcdPageProps = {
  //
} & {};
export function JcdPage(props: JcdPageProps) {
  const [ projPreviews, setProjPreviews ] = useState<JcdProjPreview[]>();

  useEffect(() => {
    jcdService.getProjectPreviews().then((_projPreviews) => {
      setProjPreviews(_projPreviews);
    });
  }, []);

  return (
    <div className="jcd-page">
      <h1>
        jcd
      </h1>
      <div className="jcd-proj-previews">
        {projPreviews && projPreviews.map((projPrev) => (
          <JcdProjPreviewItem
            key={projPrev.projectKey}
            projPreview={projPrev}
          />
        ))}
      </div>
    </div>
  );
}
