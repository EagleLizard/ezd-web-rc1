
import './jcd-proj-pane.css';

import type { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import { JcdProject } from '../../../../lib/models/jcd/jcd-project';
import { config } from '../../../../lib/config';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';
import { jcdUtil } from '../../../../service/jcd-util';

type JcdProjPaneProps = {
  jcdProjPreview: JcdProjPreview;
  jcdProject?: JcdProject;

  onClose?: () => void;
} & {};
export function JcdProjPane(props: JcdProjPaneProps) {
  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img/${
    props.jcdProjPreview.titleUri
  }?width=600`;

  const projDateStr = props.jcdProject === undefined ? '' : `${
    jcdUtil.getDisplayDate(props.jcdProject.month)
  } ${
    props.jcdProject.year
  }`;

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
      <div className="content">
        <div className="title-img-item">
          <img src={titleImgUrl}/>
        </div>
        <div className="proj-info-field">
          {props.jcdProject?.venue}
        </div>
        <div className="proj-info-field">
          {props.jcdProject?.producer}
        </div>
        <div className="proj-info-kvs">
          <div className="field-key">
            Venue
          </div>
          <div className="field-value">
            {props.jcdProject?.venue}
          </div>
          <div className="field-key">
            Producer
          </div>
          <div className="field-value">
            {props.jcdProject?.producer}
          </div>
          <div className="field-key">
            Date
          </div>
          <div className="field-value">
            {projDateStr}
          </div>
          <div className="field-key">
            Playwright(s)
          </div>
          <div className="field-value">
            <ul className="playwrights">
              {props.jcdProject?.playwright.map((playwright, idx) => {
                return (
                  <li key={idx}>
                    {playwright}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="field-key">
            Prod. Credits
          </div>
          <div className="field-value">
            <ul className="prod-credits">
              {props.jcdProject?.productionCredits.map((prodCredit, idx) => {
                return (
                  <li key={idx}>
                    {prodCredit}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="media-and-press">
          <h3>Media & Press</h3>
          {props.jcdProject?.mediaAndPress.map((mediaPress, idx) => {
            return (
              <div className="proj-info-kvs" key={idx}>
                <div className="field-key">Publication</div>
                <div className="field-value">
                  {mediaPress.publication}
                </div>
                <div className="field-key">Link</div>
                <div className="field-value">
                  <a href={mediaPress.link.uri}>{mediaPress.link.label}</a>
                </div>
                <div className="field-key">Desc.</div>
                <div className="field-value">
                  {mediaPress.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
