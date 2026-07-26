
import './jcd-proj-preview-item.css';

import React from 'react';
import { JcdProjPreview } from '../../../../lib/models/jcd/jcd-proj-preview';
import { config } from '../../../../lib/config';
import { Link } from '@tanstack/react-router';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';

type JcdProjPreviewItemProps = {
  projPreview: JcdProjPreview;
  onToggleClick?: () => void;
} & {};

export function JcdProjPreviewItem(props: JcdProjPreviewItemProps) {
  const titleImgUrl = `${config.EZD_API_BASE_URL}/v1/jcd/img/${props.projPreview.titleUri}?width=100`;
  return (
    <div className="jcd-proj-preview-item">
      <div className="heading">
        <div className="title">
          {props.projPreview.title}
        </div>
        <div className="actions">
          <EzdIconButton onClick={handleToggleClick}>
            &gt;
          </EzdIconButton>
        </div>
      </div>
      <div className="content">
        <div className="info">
          <div className="info-item">
            {props.projPreview.projectKey.split('_').map((word, idx, splat) => {
              return (
                <>{word}{(idx < splat.length - 1)
                  ? (<><wbr/>_<wbr/></>)
                  : ''
                }</>
              );
            })}
          </div>
          <div className="info-item">
            {props.projPreview.route}
          </div>
          <div className="project-nav">
            <Link
              to="/jcd/$project"
              params={{
                project: props.projPreview.route,
              }}
            >link</Link>
          </div>
        </div>
        <div className="img-item">
          <img src={titleImgUrl}/>
        </div>
      </div>
    </div>
  );
  function handleToggleClick($e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    props.onToggleClick?.();
  }
}
