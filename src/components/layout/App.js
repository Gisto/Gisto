import React from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import * as Mousetrap from 'mousetrap';
import { withRouter } from 'react-router-dom';

import { isElectron } from 'utils/electron';

import SuperSearch from 'components/layout/SuperSearch';
import KeyBindings from 'components/layout/KeyBindings';

// if (process.env.NODE_ENV === 'development') {
//   require('mimic');
// }

const GlobalStyle = createGlobalStyle`
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  
  ::-webkit-scrollbar-track {
    background: #fff;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.baseAppColor};
  }
  
  a:hover,
  span:hover {
    transition: all .3s ease-in-out;
  }
  
  *:focus {
    outline-color: ${(props) => props.theme.baseAppColor};
  }
`;

const AppWrapper = styled.div`
  display: flex;
  background: #fff;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  color: ${(props) => props.theme.baseAppColor};
`;

export class App extends React.Component {
  state = {
    showSuperSearch: false,
    showKeyBindings: false
  };

  componentDidMount() {
    Mousetrap.bind(['command+f', 'ctrl+f'], this.toggleSuperSesrch);
    Mousetrap.bind(['?'], this.toggleKeyBindings);
    Mousetrap.bind(['esc'], this.toggleAllOff);

    // Disallow to drop files
    document.addEventListener('dragover', (event) => event.preventDefault());
    document.addEventListener('dragenter', (event) => event.preventDefault());
    document.addEventListener('dragleave', (event) => event.preventDefault());
    document.addEventListener('drop', (event) => event.preventDefault());

    if (isElectron) {
      const { ipcRenderer } = require('electron');

      // Route if 'routeTo' event sent from main
      ipcRenderer.on('routeTo', (event, routeTo) => {
        this.props.history.push(routeTo);
      });
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(['command+f', 'ctrl+f'], this.toggleSuperSesrch);
    Mousetrap.unbind(['?'], this.toggleKeyBindings);
    Mousetrap.unbind(['esc'], this.toggleAllOff);
  }

  toggleSuperSesrch = () => {
    this.setState((prevState) => ({
      showSuperSearch: !prevState.showSuperSearch
    }));
  };

  toggleKeyBindings = () => {
    this.setState((prevState) => ({
      showKeyBindings: !prevState.showKeyBindings
    }));
  };

  toggleAllOff = () => {
    this.setState({
      showKeyBindings: false,
      showSuperSearch: false
    });
  };

  render() {
    return (
      <AppWrapper>
        <GlobalStyle/>
        {this.props.children}
        {this.state.showSuperSearch && (
          <SuperSearch toggleSuperSesrch={ () => this.toggleSuperSesrch() }/>
        )}
        {this.state.showKeyBindings && <KeyBindings/>}
      </AppWrapper>
    );
  }
}

App.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object
};

export default withRouter(App);
