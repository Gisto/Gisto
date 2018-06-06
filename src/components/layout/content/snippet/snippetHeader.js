import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash/fp';
import styled from 'styled-components';

import { defaultGistURL } from 'constants/config';
import { baseAppColor, borderColor, colorDanger, headerBgLightest } from 'constants/colors';

import Icon from 'components/common/Icon';
import UtilityIcon from 'components/common/UtilityIcon';
import ExternalLink from 'components/common/ExternalLink';

import { copyToClipboard } from 'utils/snippets';

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

const SnippetHeader = ({ file, username, snippetId }) => {
  const openOnWebUrl = `${defaultGistURL}/${username}/${snippetId}#file-${file.filename}`;

  return (
    <SnippetHeaderWrapper>
      <div>
        <Icon size={ 22 } color={ baseAppColor } type="file"/>
        {get('filename', file)}
      </div>
      <div>
        <Language>{get('language', file)}</Language>
        <UtilityIcon size={ 22 } color={ baseAppColor } type="ellipsis" dropdown>
          <ul>
            <li>
              <ExternalLink href={ openOnWebUrl }>
                Open on web
              </ExternalLink>
            </li>
            <li>
              <a onClick={ (event) => copyToClipboard(event, file.content) }>
                Copy file content to clipboard
              </a>
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
};

SnippetHeader.propTypes = {
  file: PropTypes.object,
  username: PropTypes.string,
  snippetId: PropTypes.string
};

export default SnippetHeader;
