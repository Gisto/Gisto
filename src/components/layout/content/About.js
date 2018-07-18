import React from 'react';
import styled from 'styled-components';

import ExternalLink from 'components/common/ExternalLink';

import * as packageJson from '../../../../package.json';
import logoImg from '../../../../build/icon.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  margin: 0 auto;
`;

export const About = () => (
  <Wrapper>
    <img src={ logoImg } width="80" alt=""/>
    <h2>About Gisto</h2>
    <p>Current version <strong>v{packageJson.version}</strong></p>

    <p>
      Gisto is a code snippet manager that runs on GitHub Gists and adds additional features such as
      searching,
      tagging and sharing gists while including a rich code editor.
    </p>

    <p>
      All your data is stored on GitHub and you can access it from GitHub Gists at any time with
      changes carrying over to Gisto.
    </p>

    <p>
      <ExternalLink href="https://github.com/Gisto/Gisto">GitHub</ExternalLink>&nbsp;|&nbsp;
      <ExternalLink href="https://gistoapp.com">Website gistoapp.com</ExternalLink>&nbsp;|&nbsp;
      <ExternalLink href="https://github.com/Gisto/Gisto/issues">Issues</ExternalLink>&nbsp;|&nbsp;
      <ExternalLink href="https://twitter.com/gistoapp">Twitter</ExternalLink>
    </p>

  </Wrapper>
);

About.propTypes = {};

export default About;
