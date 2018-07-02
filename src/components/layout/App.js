import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { baseAppColor } from 'constants/colors';
import * as Mousetrap from 'mousetrap';
import SuperSearch from 'components/layout/SuperSearch';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  color: ${baseAppColor};
`;

export class App  extends React.Component {
  state = {
    showSuperSearch: false
  };

  componentDidMount() {
    Mousetrap.bind(['shift shift', 'ctrl+f'], this.toggleSuperSesrch);
  }
  componentWillUnmount() {
    Mousetrap.unbind(['shift shift', 'ctrl+f'], this.toggleSuperSesrch);
  }

  toggleSuperSesrch = () => {
    this.setState({
      showSuperSearch: this.state.showSuperSearch = !this.state.showSuperSearch
    });
  };

  render() {
    return (
      <AppWrapper>
        { this.props.children }
        { this.state.showSuperSearch && (
          <SuperSearch toggleSuperSesrch={ () => this.toggleSuperSesrch() }/>
        ) }
      </AppWrapper>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

export default App;
