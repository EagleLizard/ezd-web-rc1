
import './jcd-project-page.css';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { jcdService } from '../../../../service/jcd-service';
import { config } from '../../../../lib/config';
import { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';

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
      return jcdService.getProjectPreviewByRoute(_jcdProj.route).then((_jcdProjPreview) => {
        setJcdProjPreview(_jcdProjPreview);
      });
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
          <h1>
            {jcdProj.title}
          </h1>
          <div>
            <div>{jcdProj.venue}</div>
            <div>{jcdProj.year}</div>
          </div>
        </>
      )}
    </div>
  );
}
