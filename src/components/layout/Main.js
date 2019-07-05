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
import { getSetting } from 'utils/settings';

import Editor from 'components/common/controls/Editor';

const MainWrapper = styled.div`
  display: flex;
  min-height: 0; // due to https://bugs.chromium.org/p/chromium/issues/detail?id=927066
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

const HiddenEditor = styled.div`
  width: 0;
  height: 0;
  display: none;
`;

export class Main extends React.Component {
  componentDidMount() {
    const { getStarredSnippets, getSnippets, getEmoji } = this.props;

    getStarredSnippets();
    getSnippets();
    getEmoji();
    gaEvent({ category: 'general', action: 'App loaded' });
  }

  componentDidUpdate(prevProps) {
    const { getSnippets } = this.props;

    if (prevProps.sinceLastUpdated === null || this.props.sinceLastUpdated !== null) {
      const interval = getSetting('snippets-server-polling-in-seconds', 300);

      this.poll(
        () =>
          new Promise(() => {
            getSnippets(this.props.sinceLastUpdated);
          }),
        parseInt(interval) * 1000
      );
    }
  }

  poll = (promiseFn, time) =>
    promiseFn().then(this.sleep(time).then(() => this.poll(promiseFn, time)));

  sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  render() {
    const { edit, isCreateNew } = this.props;

    return (
      <MainWrapper>
        {!edit && !isCreateNew && <Sidebar/>}
        <Content/>
        <HiddenEditor>
          <Editor file={ { collapsed: false, content: 'temp' } }/>
        </HiddenEditor>
      </MainWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  edit: get(['ui', 'snippets', 'edit'], state),
  sinceLastUpdated: get(['snippets', 'lastUpdated'], state),
  isCreateNew: get(['router', 'location', 'pathname'], state) === '/new'
});

Main.propTypes = {
  edit: PropTypes.bool,
  isCreateNew: PropTypes.bool,
  getSnippets: PropTypes.func,
  getStarredSnippets: PropTypes.func,
  getEmoji: PropTypes.func,
  sinceLastUpdated: PropTypes.string
};

export default connect(
  mapStateToProps,
  {
    getSnippets: snippetActions.getSnippets,
    getEmoji: emojiActions.getEmoji,
    getStarredSnippets: snippetActions.getStarredSnippets
  }
)(Main);
