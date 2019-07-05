import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { get, map, filter, size, isNaN, debounce } from 'lodash/fp';

import * as snippetActions from 'actions/snippets';

import Editor from 'components/common/controls/Editor';
import SnippetHeader from 'components/layout/content/snippet/SnippetHeader';

import 'github-markdown-css/github-markdown.css';
import Comments from 'components/layout/content/snippet/Comments';
import { toUnixTimeStamp } from 'utils/date';
import { getSetting } from 'utils/settings';
import { randomString } from 'utils/string';
import DropZone from 'components/common/DropZone';
import Icon from 'components/common/Icon';

const SnippetWrapper = styled.div`
  background: #fff;
  font-weight: 200;
  width: auto;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  box-shadow: 0 0 10px ${(props) => props.theme.borderColor};
  flex: 1;
  margin-bottom: 20px;
`;

const EditArea = styled.div`
  display: flex;
`;

const Or = styled.div`
  margin-right: 20px;
  line-height: 60px;
`;

const AddNewFile = styled.button`
  margin: 0 20px 20px 0;
  background: ${(props) => props.theme.baseAppColor};
  border-radius: 10px;
  width: 60px;
  color: #fff;
  cursor: pointer;
`;

const StyledDropZone = styled(DropZone)`
  margin-bottom: 20px;
  flex: 1;
`;

export class Snippet extends React.Component {
  updateSnippet = debounce(300, this.props.updateTempSnippet);

  componentDidMount() {
    const id = this.props.match.params.id || this.props.snippet.id;

    this.props.getSnippet(id);
  }

  componentDidUpdate(prevProps) {
    /* istanbul ignore if */
    if (prevProps.match.params.id !== this.props.match.params.id) {
      const now = toUnixTimeStamp(new Date());
      const viewed = get('viewed', this.props.snippet);

      const shouldGetSnippet =
        isNaN(get('lastModified', this.props.snippet)) ||
        now - viewed > (getSetting('snippet-fetch-cache-in-seconds') || 100);

      if (get('files', this.props.snippet) && shouldGetSnippet) {
        this.props.getSnippet(this.props.match.params.id || this.props.snippet.id);
      }
    }
  }

  render() {
    const { snippet, edit, tempSnippet, showComments, addTempFile } = this.props;
    const currentSnippet = edit ? tempSnippet : snippet;
    const files = filter((file) => !file.delete, get('files', currentSnippet));

    if (!this.props.snippet) {
      return null;
    }

    return (
      <React.Fragment>
        {showComments && <Comments snippetId={ this.props.match.params.id }/>}

        {edit && (
          <EditArea>
            <AddNewFile title="Add new file" onClick={ () => addTempFile(randomString(5), '') }>
              <Icon type="add" size={ 40 }/>
            </AddNewFile>
            <Or>Or</Or>
            <StyledDropZone onAddFile={ addTempFile }/>
          </EditArea>
        )}

        {map(
          (file) => (
            <SnippetWrapper key={ file.uuid || `${file.size}-${file.viewed}-${file.filename}` }>
              <SnippetHeader file={ file } username={ snippet.username } snippetId={ snippet.id }/>
              <Editor
                file={ file }
                edit={ edit }
                filesCount={ size(files) }
                height={ file.collapsed ? 0 : 400 }
                onChange={ (value) => this.updateSnippet(['files', file.uuid, 'content'], value) }/>
            </SnippetWrapper>
          ),
          files
        )}
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
  addTempFile: PropTypes.func,
  showComments: PropTypes.any
};

export default connect(
  mapStateToProps,
  {
    getSnippet: snippetActions.getSnippet,
    updateTempSnippet: snippetActions.updateTempSnippet,
    addTempFile: snippetActions.addTempFile
  }
)(Snippet);
