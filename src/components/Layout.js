import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'assets/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';

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
    <ToastContainer autoClose={ 8000 } />
  </App>
);

export default Layout;
