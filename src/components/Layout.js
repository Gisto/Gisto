import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import 'assets/styles.css';
import 'react-toastify/dist/ReactToastify.min.css';

import { isLoggedIn } from 'utils/login';

import App from 'components/layout/App';
import MainHeader from 'components/layout/headers/MainHeader';
import SubHeader from 'components/layout/headers/SubHeader';
import Main from 'components/layout/Main';
import LogIn from 'components/LogIn';

export const Layout = ({ theme }) => (
  <ThemeProvider theme={ theme }>
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
  </ThemeProvider>
);

Layout.propTypes = {
  theme: PropTypes.object
};

const mapStateToProps = (state) => ({
  theme: state.ui.settings.theme
});

export default connect(mapStateToProps)(Layout);
