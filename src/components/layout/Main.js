import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';
import styled from 'styled-components';
import Sidebar from 'components/layout/sidebar/Sidebar';
import Content from 'components/layout/Content';

import * as snippetActions from 'actions/snippets';
import * as emojiActions from 'actions/emoji';
import { gaEvent } from 'utils/ga';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

export class Main extends React.Component {
  componentDidMount() {
    const {
      getStarredSnippets, getSnippets, getEmoji
    } = this.props;

    getStarredSnippets();
    getSnippets();
    getEmoji();
    gaEvent({ category: 'general', action: 'App loaded' });
  }

  render() {
    const { edit, isCreateNew } = this.props;

    return (
      <MainWrapper>
        { !edit && !isCreateNew && <Sidebar/> }
        <Content/>
      </MainWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  edit: get(['ui', 'snippets', 'edit'], state),
  sinceLastUpdated: get(['snippets', 'snippets', 'lastUpdated'], state),
  isCreateNew: get(['router', 'location', 'pathname'], state) === '/new'
});

Main.propTypes = {
  edit: PropTypes.bool,
  isCreateNew: PropTypes.bool,
  getSnippets: PropTypes.func,
  getStarredSnippets: PropTypes.func,
  getEmoji: PropTypes.func
};

export default connect(mapStateToProps, {
  getSnippets: snippetActions.getSnippets,
  getEmoji: emojiActions.getEmoji,
  getStarredSnippets: snippetActions.getStarredSnippets
})(Main);
