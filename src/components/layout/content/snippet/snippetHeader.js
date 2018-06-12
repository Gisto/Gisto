import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';
import styled from 'styled-components';

import { defaultGistURL } from 'constants/config';
import { baseAppColor, borderColor, headerBgLightest } from 'constants/colors';

import { copyToClipboard } from 'utils/snippets';
import * as snippetActions from 'actions/snippets';

import Icon from 'components/common/Icon';
import UtilityIcon from 'components/common/UtilityIcon';
import ExternalLink from 'components/common/ExternalLink';
import Input from 'components/common/Input';
import Anchor from 'components/common/Anchor';

const SnippetHeaderWrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 0 0 0 20px;
  border-bottom: 1px solid ${borderColor};
  border-radius: 3px 3px 0 0;
  line-height: 50px;
  justify-content: space-between;
  background: ${headerBgLightest};
  color: ${baseAppColor};
`;

const Language = styled.span`
  padding: 0 20px 0 0;
  font-size: 14px;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
`;

export class SnippetHeader extends React.Component {
  renderFileName = () => {
    const {
      file, edit, tempSnippet, updateTempSnippet
    } = this.props;

    if (!edit) {
      return get('filename', file);
    }

    return (
      <Input value={ get(['files', file.uuid, 'filename'], tempSnippet) }
             onChange={ (event) => updateTempSnippet(['files', file.uuid, 'filename'], event.target.value) }/>
    );
  };

  render() {
    const { file, username, snippetId } = this.props;
    const openOnWebUrl = `${defaultGistURL}/${username}/${snippetId}#file-${file.filename}`;

    return (
      <SnippetHeaderWrapper>
        <FileName><Icon size={ 22 } color={ baseAppColor } type="file"/> { this.renderFileName() }</FileName>
        <div>
          <Language>{get('plain', 'language', file) || 'Plain text'}</Language>
          <UtilityIcon size={ 22 } color={ baseAppColor } type="ellipsis" dropdown>
            <ul>
              <li>
                <ExternalLink href={ openOnWebUrl }>
                  Open on web
                </ExternalLink>
              </li>
              <li>
                <Anchor onClick={ (event) => copyToClipboard(event, file.content) }>
                  Copy file content to clipboard
                </Anchor>
              </li>
              <li>
                <a download={ file.filename } href={ file.raw_url }>
                  Download
                </a>
              </li>
              <li>
                Delete
              </li>
            </ul>
          </UtilityIcon>
          <UtilityIcon size={ 22 } color={ baseAppColor } type="arrow-up" onClick={ null }/>
        </div>
      </SnippetHeaderWrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  edit: get(['ui', 'snippets', 'edit'], state),
  tempSnippet: get(['snippets', 'edit'], state)
});

SnippetHeader.propTypes = {
  file: PropTypes.object,
  username: PropTypes.string,
  snippetId: PropTypes.string,
  edit: PropTypes.bool,
  tempSnippet: PropTypes.object,
  updateTempSnippet: PropTypes.func
};

export default connect(mapStateToProps, {
  updateTempSnippet: snippetActions.updateTempSnippet
})(SnippetHeader);
