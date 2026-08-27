
import './jcd-project-page.css';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';
import { config } from '../../../../lib/config';
import { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import { jcdUtil } from '../../../../service/jcd-util';

type JcdProjectPageProps = {
  projectRoute: string;
} & {};
export function JcdProjectPage(props: JcdProjectPageProps) {
  const [ jcdProj, setJcdProj ] = useState<JcdProject | undefined>();
  const [ jcdProjPreview, setJcdProjPreview ] = useState<JcdProjPreview | undefined>();

  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img/${jcdProjPreview?.titleUri}?width=100`;

  useEffect(() => {
    jcdService.getProjectByRoute(props.projectRoute).then((_jcdProj) => {
      setJcdProj(_jcdProj);
    });
    jcdService.getProjectPreviewByRoute(props.projectRoute).then((_jcdProjPreview) => {
      setJcdProjPreview(_jcdProjPreview);
    });
  }, [ props.projectRoute ]);

  return (
    <div className="jcd-project-page">
      {jcdProj && jcdProjPreview && (
        <>
          <div>
            <Link to="/jcd">{'<'} Back to projects</Link>
          </div>
          <div>
            <img src={titleImgUrl}/>
          </div>
          <div>

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
