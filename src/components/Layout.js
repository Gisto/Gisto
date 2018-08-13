import React from 'react';
import 'assets/styles.css';

import { isLoggedIn } from 'utils/login';

import App from 'components/layout/App';
import MainHeader from 'components/layout/headers/MainHeader';
import SubHeader from 'components/layout/headers/SubHeader';
import Main from 'components/layout/Main';
import LogIn from 'components/LogIn';

export const Layout = () => (
  <App>
    { isLoggedIn ? (
      <React.Fragment>
        <MainHeader/>
        <SubHeader/>
        <Main/>
      </React.Fragment>
    ) : <LogIn/> }
  </App>
);

export default Layout;
