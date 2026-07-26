
import './jcd-proj-pane.css';

import type { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import type { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { config } from '../../../../lib/config';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';

type JcdProjPaneProps = {
  jcdProjPreview: JcdProjPreview;
  jcdProject?: JcdProject;

  onClose?: () => void;
} & {};
export function JcdProjPane(props: JcdProjPaneProps) {

  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img/${props.jcdProjPreview.titleUri}?width=100`;

  return (
    <div className="jcd-proj-pane">
      <div className="heading">
        <h2>
          {props.jcdProjPreview.title}
        </h2>
        <div className="heading-actions">
          <EzdIconButton onClick={props.onClose}>
            X
          </EzdIconButton>
        </div>
      </div>
      <div className="title-img-item">
        <img src={titleImgUrl}/>
      </div>
      <div>
        {props.jcdProject?.venue}
      </div>
    </div>
  );
}
