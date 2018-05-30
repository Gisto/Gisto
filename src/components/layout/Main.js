import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Sidebar from 'components/layout/sidebar/Sidebar';
import Content from 'components/layout/Content';

import * as snippetActions from 'actions/snippets';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

export class Main extends React.Component {
  componentDidMount() {
    this.props.getStarredSnippets();
    this.props.getSnippets();
  }

  render() {
    const { showSidebar } = this.props;

    return (
      <MainWrapper>
        <Sidebar showSidebar={ showSidebar }/>
        <Content/>
      </MainWrapper>
    );
  }
}

Main.propTypes = {
  showSidebar: PropTypes.bool,
  getSnippets: PropTypes.func,
  getStarredSnippets: PropTypes.func
};

export default connect(null, {
  getSnippets: snippetActions.getSnippets,
  getStarredSnippets: snippetActions.getStarredSnippets
})(Main);
