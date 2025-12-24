
import './whoami.css';

import { useState } from 'react';

import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { userService } from '../../../../service/user-service';
import { WhoamiResp } from '../../../../lib/models/whoami-resp';
import { EzdLoadingSpinner } from '../../../components/ezd-loading-spinner/ezd-loading-spinner';

type WhoamiProps = {
  //
} & {};

export function Whoami(props: WhoamiProps) {
  const [ whoamiLoading, setWhoamiLoading ] = useState<boolean>(false);

  const [ whoamiRes, setWhoamiRes ] = useState<WhoamiResp | undefined>();
  return (
    <div className="whoami">
      <div className="whoami-button">
        <EzdButton onClick={handleWhoamiClick}>
          whoami
        </EzdButton>
        {whoamiLoading && (
          <EzdLoadingSpinner/>
        )}
      </div>
      <div className="whoami-content">
        {whoamiRes && (
          <table className="prop-table">
            <thead>
              <tr>
                <th>
                  <EzdButton onClick={handleWhoamiRespCloseClick}>
                    X
                  </EzdButton>
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(whoamiRes.user).map(([ k, v ]) => {
                return (
                  <tr key={k}>
                    <td>
                      <code>
                        {k}
                      </code>
                    </td>
                    <td>
                      <code>
                        {v}
                      </code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  function handleWhoamiRespCloseClick() {
    setWhoamiRes(undefined);
  }

  function handleWhoamiClick() {
    setWhoamiRes(undefined);
    setWhoamiLoading(true);
    userService.getWhoami().then(res => {
      console.log('whoami res:');
      console.log(res);
      if(res !== undefined) {
        setWhoamiRes(res);
      }
    }).catch(err => {
      console.log('whoami err');
      console.log(err);
    }).finally(() => {
      setWhoamiLoading(false);
    });
  }
}
