import React from 'react';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from 'constants/config';
import { baseAppColor } from 'constants/colors';
import BaseSettings from 'components/layout/content/settings/Base';
import EditorSettings from 'components/layout/content/settings/Editor';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #555;
  height: 100%;
  justify-content: baseline;
  align-items: baseline;
  text-align: left;
  
  h2:first-of-type {
    margin-top: 0;
  }
  details {
    border: 1px solid ${baseAppColor};
    padding: 20px;
    margin: 0 0 20px;
    border-radius: 3px;
    display: block;
    width: calc(100vw - ${SIDEBAR_WIDTH + 80}px);
    
    > div {
      margin: 20px;
    }
    summary {
      color: ${baseAppColor};
      outline: none;
      cursor: pointer;
      &::-webkit-details-marker {
        color: ${baseAppColor};
      }
    }
  }
}
`;

export const Settings = () => (
  <Wrapper>
    <h2>Settings</h2>

    <details>
      <summary>Base settings</summary>
      <BaseSettings/>
    </details>

    <details>
      <summary>Editor</summary>
      <EditorSettings/>
    </details>

  </Wrapper>
);

Settings.propTypes = {};

export default Settings;
