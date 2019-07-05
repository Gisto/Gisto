import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import 'react-toastify/dist/ReactToastify.min.css';
import 'assets/styles.css';

import { isLoggedIn } from 'utils/login';

import App from 'components/layout/App';
import MainHeader from 'components/layout/headers/MainHeader';
import SubHeader from 'components/layout/headers/SubHeader';
import Main from 'components/layout/Main';
import LogIn from 'components/LogIn';
import { getSetting } from 'utils/settings';
import Icon from 'components/common/Icon';

const CloseButton = ({ closeToast }) => <Icon clickable onClick={ closeToast } type="close"/>;

CloseButton.propTypes = {
  closeToast: PropTypes.func
};

export const Layout = ({ theme }) => {
  // Check if it is oauth login window and close it
  if (window.location.href.match('tokenSet') && window.location.href.match('tokenSet').length > 0) {
    window.close();

    return <h4>You can close this window now</h4>;
  }

  return (
    <ThemeProvider theme={ theme }>
      <App>
        {isLoggedIn ? (
          <React.Fragment>
            <MainHeader/>
            <SubHeader/>
            <Main/>
          </React.Fragment>
        ) : (
          <LogIn/>
        )}
        <ToastContainer
          position={ getSetting('settings-notification-position', 'top-center') }
          closeButton={ <CloseButton/> }
          autoClose={ 8000 }/>
      </App>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  theme: PropTypes.object
};

const mapStateToProps = (state) => ({
  theme: state.ui.settings.theme
});

export default connect(mapStateToProps)(Layout);
