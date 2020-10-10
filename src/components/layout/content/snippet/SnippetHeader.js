import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get, getOr, debounce } from 'lodash/fp';
import styled from 'styled-components';

import { copyToClipboard } from 'utils/snippets';
import { isPDF, isImage } from 'utils/files';
import * as snippetActions from 'actions/snippets';

import Icon from 'components/common/Icon';
import UtilityIcon from 'components/common/UtilityIcon';
import ExternalLink from 'components/common/ExternalLink';
import Input from 'components/common/controls/Input';
import Anchor from 'components/common/Anchor';
import { getSnippetUrl } from 'utils/url';

export class SnippetHeader extends React.Component {
  updateSnippet = debounce(300, this.props.updateTempSnippet);

  deleteFile = (id, fileName) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    const sure = confirm(`Are you sure you want to delete "${fileName}" file?`);

    if (sure === true) {
      this.props.deleteFile(id);

      return true;
    }

    return false;
  };

  renderFileName = () => {
    const { file, edit, tempSnippet } = this.props;

    if (!edit || (edit && (isImage(file) || isPDF(file)))) {
      return get('filename', file);
    }

    return (
      <Input
        value={ get(['files', file.uuid, 'filename'], tempSnippet) }
        onChange={ (event) =>
          this.updateSnippet(['files', file.uuid, 'filename'], event.target.value)
        }/>
    );
  };

  render() {
    const { file, username, snippetId, edit, toggleCollapse, theme } = this.props;
    const openOnWebUrl = `${getSnippetUrl('/gist')}/${username}/${snippetId}#file-${file.filename}`;

    return (
      <SnippetHeaderWrapper>
        <FileName>
          <FilenameIcon size={ 22 } color={ theme.baseAppColor } type="file"/> {this.renderFileName()}{' '}
          {edit && (isPDF(file) || isImage(file)) && (
            <em>
              <small style={ { color: theme.colorDanger } }>
                &nbsp;&nbsp;&nbsp;
                {`(${file.language || 'this kind of '} files are read only)`}
              </small>
            </em>
          )}
        </FileName>

        {!edit ? (
          <div>
            <Language>{getOr('Plain text', 'language', file)}</Language>
            <UtilityIcon size={ 22 } color={ theme.baseAppColor } type="ellipsis" dropdown>
              <ul>
                <li>
                  <ExternalLink href={ openOnWebUrl }>Open on web</ExternalLink>
                </li>
                <li>
                  <Anchor onClick={ (event) => copyToClipboard(event, file.content) }>
                    Copy file content to clipboard
                  </Anchor>
                </li>
                <li>
                  <Anchor download={ file.filename } href={ file.raw_url }>
                    Download
                  </Anchor>
                </li>
              </ul>
            </UtilityIcon>
            <UtilityIcon
              size={ 22 }
              color={ theme.baseAppColor }
              type={ file.collapsed ? 'arrow-up' : 'arrow-down' }
              onClick={ () => toggleCollapse(snippetId, file.filename) }/>
          </div>
        ) : (
          <UtilityIcon
            size={ 22 }
            color={ theme.colorDanger }
            type="delete"
            onClick={ () => this.deleteFile(file.uuid, file.filename) }/>
        )}
      </SnippetHeaderWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  edit: get(['ui', 'snippets', 'edit'], state),
  tempSnippet: get(['snippets', 'edit'], state),
  theme: get(['ui', 'settings', 'theme'], state)
});

SnippetHeader.propTypes = {
  file: PropTypes.object,
  theme: PropTypes.object,
  username: PropTypes.string,
  snippetId: PropTypes.string,
  edit: PropTypes.bool,
  tempSnippet: PropTypes.object,
  updateTempSnippet: PropTypes.func,
  deleteFile: PropTypes.func,
  toggleCollapse: PropTypes.func
};

const SnippetHeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 0 0 0 20px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 3px 3px 0 0;
  line-height: 50px;
  justify-content: space-between;
  background: ${(props) => props.theme.headerBgLightest};
  color: ${(props) => props.theme.baseAppColor};
`;

const Language = styled.span`
  padding: 0 20px 0 0;
  font-size: 14px;
`;

const FilenameIcon = styled(Icon)`
  margin: 0 20px 0 0;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
`;

export default connect(
  mapStateToProps,
  {
    updateTempSnippet: snippetActions.updateTempSnippet,
    deleteFile: snippetActions.deleteTempFile,
    toggleCollapse: snippetActions.toggleCollapse
  }
)(SnippetHeader);
