import React from 'react';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from 'constants/config';
import BaseSettings from 'components/layout/content/settings/Base';
import EditorSettings from 'components/layout/content/settings/Editor';
import SnippetsSettings from 'components/layout/content/settings/Snippets';
import { gaPage } from 'utils/ga';
import { getAllSettings } from 'utils/settings';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #555;
  height: 100%;
  justify-content: flex-start;
  align-items: baseline;
  text-align: left;
  
  h2:first-of-type {
    margin-top: 0;
  }
  details {
    border: 1px solid ${(props) => props.theme.baseAppColor};
    padding: 20px;
    margin: 0 0 20px;
    border-radius: 3px;
    display: block;
    width: calc(100vw - ${SIDEBAR_WIDTH + 80}px);
    
    > div {
      margin: 20px;
    }
    summary {
      color: ${(props) => props.theme.baseAppColor};
      outline: none;
      cursor: pointer;
      &::-webkit-details-marker {
        color: ${(props) => props.theme.baseAppColor};
      }
    }
  }
}
`;

export class Settings extends React.Component {
  componentDidMount() {
    gaPage('Settings');
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.table(getAllSettings());
    }
  }

  render() {
    return (
      <Wrapper>
        <h2>Settings</h2>

        <details>
          <summary>General</summary>
          <BaseSettings/>
        </details>

        <details>
          <summary>Snippets</summary>
          <SnippetsSettings/>
        </details>

        <details>
          <summary>Editor</summary>
          <EditorSettings/>
        </details>
      </Wrapper>
    );
  }
}

Settings.propTypes = {};

export default Settings;
