import React from 'react';
import 'assets/styles.css';

import App from 'components/layout/App';
import MainHeader from 'components/layout/headers/MainHeader';
import SubHeader from 'components/layout/headers/SubHeader';
import Main from 'components/layout/Main';

const Layout = () => (
  <App>
    <MainHeader/>
    <SubHeader/>
    <Main/>
  </App>
);

export default Layout;
