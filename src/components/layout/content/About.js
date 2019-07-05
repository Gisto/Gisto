import React from 'react';
import styled from 'styled-components';

import { get } from 'lodash/fp';

import { isElectron } from 'utils/electron';
import { gaPage } from 'utils/ga';

import ExternalLink from 'components/common/ExternalLink';
import Anchor from 'components/common/Anchor';

import * as packageJson from '../../../../package.json';
import logoImg from '../../../../build/icon.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #555;
  height: 100%;
  width: 50%;
  transform: translate(50%);
  justify-content: center;
  text-align: left;
`;

const UpdateInfo = styled.div`
  border: 1px solid ${(props) => props.theme.baseAppColor};
  padding: 10px;
  background: ${(props) => props.theme.bg};
  border-radius: 3px;
`;

export class About extends React.Component {
  state = {
    message: ''
  };

  componentDidMount() {
    gaPage('About');
    /* istanbul ignore if */
    if (isElectron) {
      const { ipcRenderer } = require('electron');

      ipcRenderer.send('checkForUpdate');
      ipcRenderer.on('updateInfo', (event, text, info) => {
        const url = get('url[0].browser_download_url', info);

        if (url) {
          const message = (
            <React.Fragment>
              <strong>{text}</strong>
              &nbsp;
              <Anchor href={ url }>Download</Anchor>
            </React.Fragment>
          );

          this.setState({ message });
        } else {
          this.setState({ message: text });
        }
      });
    }
  }

  render() {
    return (
      <Wrapper>
        <img src={ logoImg } width="80" alt=""/>
        <h2>About Gisto</h2>
        <p>
          Current version <strong>v{packageJson.version}</strong>
        </p>

        {this.state.message && <UpdateInfo>{this.state.message}</UpdateInfo>}

        <p>
          Gisto is a code snippet manager that runs on GitHub Gists and adds additional features
          such as searching, tagging and sharing gists while including a rich code editor.
        </p>

        <p>
          All your data is stored on GitHub and you can access it from GitHub Gists at any time with
          changes carrying over to Gisto.
        </p>

        <p>
          <ExternalLink href="https://github.com/Gisto/Gisto/blob/master/CHANGELOG.md">
            Change log
          </ExternalLink>
          &nbsp;|&nbsp;
          <ExternalLink href="https://github.com/Gisto/Gisto">GitHub</ExternalLink>
          &nbsp;|&nbsp;
          <ExternalLink href="https://gistoapp.com">Website gistoapp.com</ExternalLink>
          &nbsp;|&nbsp;
          <ExternalLink href="https://github.com/Gisto/Gisto/issues">Issues</ExternalLink>
          &nbsp;|&nbsp;
          <ExternalLink href="https://twitter.com/gistoapp">Twitter</ExternalLink>
        </p>
      </Wrapper>
    );
  }
}

About.propTypes = {};

export default About;
