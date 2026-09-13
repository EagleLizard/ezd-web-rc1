
import './jcd-env-main.css';
import { useEffect, useState } from 'react';

import { JcdProjKeyDto } from '../../../../lib/models/jcd/jcd-proj-key-dto';
import { jcdService } from '../../../../service/jcd-service';

type JcdEnvMainProps = {
  //
} & {};
export function JcdEnvMain(props: JcdEnvMainProps) {
  let [ projKeys, setProjKeys ] = useState<JcdProjKeyDto[] | undefined>();
  useEffect(() => {
    jcdService.getProjKeys().then((projKeyDtos) => {
      setProjKeys(projKeyDtos);
    });
  }, []);

  return (
    <div className="jcd-env-main">
      <div className="heading">jcd env main</div>
      <div className="content">
        <div>etc</div>
        {projKeys && (
          <div>
            {projKeys.map(projKey => (
              <div key={projKey.projectKey}>{projKey.projectKey}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
