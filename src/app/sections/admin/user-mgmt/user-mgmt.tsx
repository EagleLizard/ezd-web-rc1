
import './user-mgmt.css';

import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
// import { FaTrash } from 'react-icons/fa6';

import { EzdUserResp } from '../../../../lib/models/user/ezd-user-resp';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { EzdIconButton } from '../../../components/ezd-icon-button/ezd-icon-button';
import { EzdModal } from '../../../components/ezd-modal/ezd-modal';

const user_props: (keyof EzdUserResp['user'])[] = [
  'user_id',
  'user_name',
  'email',
  'created_at',
  'modified_at',
];
type UserMgmtRowObj = {
  userResp: EzdUserResp;
  expanded: boolean;
} & {};

type UserMgmtProps = {
  userResps?: EzdUserResp[];
} & {}
export function UserMgmt(props: UserMgmtProps) {
  const [ rowObjs, setRowObjs ] = useState<UserMgmtRowObj[] | undefined>(props.userResps?.map(userResp => {
    return {
      userResp,
      expanded: false,
    };
  }));
  const [ rowObjToDelete, setRowObjToDelete ] = useState<UserMgmtRowObj | undefined>();
  useEffect(() => {
    let nextRowObjs: UserMgmtRowObj[] | undefined = props.userResps?.map(userResp => {
      return {
        userResp,
        expanded: false,
      };
    });
    setRowObjs(nextRowObjs);
  }, [ props.userResps ]);
  return (
    <div className="user-mgmt">
      <table className="user-table">
        <thead>
          <tr>
            <th>{/* spacer for expando */}</th>
            {user_props.map((userProp) => (
              <th key={userProp}>{userProp}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowObjs?.map((rowObj) => {
            let user = rowObj.userResp.user;
            return (
              <Fragment key={user.user_id}>
                <tr>
                  <td className="row-expando-btn">
                    <EzdButton onClick={($e) => {
                      rowObj.expanded = !rowObj.expanded;
                      setRowObjs(rowObjs.slice());
                    }}>{rowObj.expanded ? '-' : '+'}</EzdButton>
                  </td>
                  {user_props.map(userProp => (
                    <td key={userProp}>
                      <code>{user[userProp]}</code>
                    </td>
                  ))}
                </tr>
                {rowObj.expanded && (
                  <tr><td colSpan={6} className="row-expando">
                    <div>
                      <EzdIconButton>
                        {/* <FaTrash onClick={() => {
                          setRowObjToDelete(rowObj);
                        }}/> */}
                        <div onClick={() => {
                          setRowObjToDelete(rowObj);
                        }}> delete </div>
                      </EzdIconButton>
                    </div>
                  </td></tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <EzdModal
        className="user-mgmt-delete-modal"
        show={rowObjToDelete !== undefined}
        onClose={() => {
          setRowObjToDelete(undefined);
        }}
      >
        <div>
          <h3>Are you sure?</h3>
          <div>
            {'You\'re about to delete the following user:'}
          </div>
          <table className="user-data">
            <thead/>
            <tbody>
              <tr>
                <td>id</td>
                <td>{rowObjToDelete?.userResp.user.user_id}</td>
              </tr>
              <tr>
                <td>username</td>
                <td>{rowObjToDelete?.userResp.user.user_name}</td>
              </tr>
              <tr>
                <td>email</td>
                <td>{rowObjToDelete?.userResp.user.email}</td>
              </tr>
            </tbody>
          </table>
          <div className="modal-actions">
            <EzdButton onClick={() => {
              setRowObjToDelete(undefined);
            }}>
              Cancel
            </EzdButton>
            <EzdButton color="delete">Delete</EzdButton>
          </div>
        </div>
      </EzdModal>
    </div>
  );
}
