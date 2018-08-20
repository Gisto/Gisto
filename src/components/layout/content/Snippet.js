import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  get, map, filter, size
} from 'lodash/fp';

import * as snippetActions from 'actions/snippets';
import { borderColor } from 'constants/colors';

import Editor from 'components/common/controls/Editor';
import SnippetHeader from 'components/layout/content/snippet/snippetHeader';

import 'github-markdown-css/github-markdown.css';
import Comments from 'components/layout/content/snippet/Comments';


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
    const id = this.props.match.params.id || this.props.snippet.id;

    this.props.getSnippet(id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
    }
  }

  render() {
    const {
      snippet, edit, tempSnippet, updateTempSnippet, showComments
    } = this.props;
    const currentSnippet = edit ? tempSnippet : snippet;
    const files = filter((file) => !file.delete, get('files', currentSnippet));

    if (!this.props.snippet) {
      return null;
    }

    return (
      <React.Fragment>
        { showComments && <Comments snippetId={ this.props.match.params.id }/> }

        { map((file) => (
          <SnippetWrapper key={ file.uuid || `${file.size}-${file.viewed}-${file.filename}` }>
            <SnippetHeader file={ file }
                           username={ snippet.username }
                           snippetId={ snippet.id }/>
            <Editor file={ file }
                    edit={ edit }
                    filesCount={ size(files) }
                    height={ file.collapsed ? 0 : 400 }
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
    comments: get(['snippets', 'comments'], state),
    tempSnippet: get(['snippets', 'edit'], state),
    edit: get(['ui', 'snippets', 'edit'], state),
    showComments: get(['ui', 'snippets', 'comments'], state)
  };
};

Snippet.propTypes = {
  match: PropTypes.object,
  snippet: PropTypes.object,
  getSnippet: PropTypes.func.isRequired,
  edit: PropTypes.bool,
  tempSnippet: PropTypes.object,
  updateTempSnippet: PropTypes.func,
  showComments: PropTypes.func
};

export default connect(mapStateToProps, {
  getSnippet: snippetActions.getSnippet,
  updateTempSnippet: snippetActions.updateTempSnippet
})(Snippet);
