
import './admin-page.css';

import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { EzdUserResp } from '../../../lib/models/user/ezd-user-resp';
import { userService } from '../../../service/user-service';
import { UserMgmt } from './user-mgmt/user-mgmt';

type AdminPageSection = {
  slug: string;
  navText: string;
  title: string;
} & {};
const admin_page_sections: Record<string, AdminPageSection> = {
  users: {
    slug: 'users',
    navText: 'users',
    title: 'user mgmt',
  },
  roles: {
    slug: 'roles',
    navText: 'roles',
    title: 'role mgmt',
  },
} as const;
const user_props: (keyof EzdUserResp['user'])[] = [
  'user_id',
  'user_name',
  'email',
  'created_at',
  'modified_at',
];

type AdminPageProps = {
  section?: string;
} & {};
export function AdminPage(props: AdminPageProps) {

  const [ userResps, setUserResps ] = useState<EzdUserResp[] | undefined>();
  const [ loadingUsers, setLoadingUsers ] = useState<boolean>(false);

  const apSection: AdminPageSection | undefined = getSection(props.section);

  const navItems = [ ...Object.values(admin_page_sections) ];

  useEffect(() => {
    if(apSection?.slug !== 'users') {
      return;
    }
    fetchUsers();
  }, [ apSection ]);
  useEffect(() => {
    // console.log({users: userResps});
  }, [ userResps ]);

  return (
    <div className="admin-page">
      <div>
        admin page ~
      </div>
      <hr/>
      <div className="admin-page-nav">
        {navItems.map((navItem) => {
          return (
            <div
              className={'nav-item' + (navItem.slug === apSection?.slug ? ' active' : '')}
              key={navItem.slug}
            >
              <Link to="/admin/{-$section}" params={{
                section: navItem.slug
              }}>
                {navItem.navText}
              </Link>
            </div>
          );
        })}
      </div>
      <hr/>
      {apSection && (
        <div className="admin-page-section-title">
          <h2>
            {apSection.title}
          </h2>
        </div>
      )}
      <div>
        admin page content
      </div>
      {apSection?.slug === 'users' && (
        <UserMgmt userResps={userResps}/>
      )}
    </div>
  );

  function fetchUsers(): Promise<void> {
    setLoadingUsers(true);
    return userService.getUsers().then(users => {
      setUserResps(users);
    }).finally(() => {
      setLoadingUsers(false);
    });
  }
}

function getSection(sectionParam: string | undefined): AdminPageSection | undefined {
  return [ ...Object.values(admin_page_sections) ].find(apSection => {
    return apSection.slug === sectionParam;
  });
}
