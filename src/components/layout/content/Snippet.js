import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get, map, filter } from 'lodash/fp';

import * as snippetActions from 'actions/snippets';
import { borderColor } from 'constants/colors';

import Editor from 'components/common/Editor';
import SnippetHeader from 'components/layout/content/snippet/snippetHeader';

import 'github-markdown-css/github-markdown.css';

const SnippetWrapper = styled.div`
  background: #fff;
  font-weight: 200;
  width: auto;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  box-shadow: 0 0 10px ${borderColor};
  flex: 1;
  margin-bottom: 20px;
`;

export class Snippet extends React.Component {
  componentDidMount() {
    this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
    }
  }

  render() {
    const {
      snippet, edit, tempSnippet, updateTempSnippet
    } = this.props;
    const currentSnippet = edit ? tempSnippet : snippet;
    const files = filter((file) => !file.delete, get('files', currentSnippet));

    if (!this.props.snippet) {
      return null;
    }

    return (
      <React.Fragment>
        {  map((file) => (
          <SnippetWrapper key={ file.uuid || `${file.size}-${file.viewed}-${file.filename}` }>
            <SnippetHeader file={ file }
                           username={ snippet.username }
                           snippetId={ snippet.id }/>
            <Editor file={ file }
                    edit={ edit }
                    onChange={ (value) => updateTempSnippet(['files', file.uuid, 'content'], value) }/>
          </SnippetWrapper>
        ), files) }
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const snippetId = ownProps.match.params.id;

  return {
    snippet: get(['snippets', 'snippets', snippetId], state),
    tempSnippet: get(['snippets', 'edit'], state),
    edit: get(['ui', 'snippets', 'edit'], state)
  };
};

Snippet.propTypes = {
  match: PropTypes.object,
  snippet: PropTypes.object,
  getSnippet: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  tempSnippet: PropTypes.object,
  updateTempSnippet: PropTypes.func
};

export default connect(mapStateToProps, {
  getSnippet: snippetActions.getSnippet,
  updateTempSnippet: snippetActions.updateTempSnippet
})(Snippet);
