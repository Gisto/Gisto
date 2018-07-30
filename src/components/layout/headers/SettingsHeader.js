import React from 'react';
import { remote } from 'electron';
import styled from 'styled-components';

import Button from 'components/common/Button';

const StyledButton = styled(Button)`
  margin-right: 10px;
`;

const reloadApp = () => remote.getCurrentWindow().reload();

const SettingsHeader = () => (
  <React.Fragment>
    <div>Settings</div>
    <StyledButton
      onClick={ () => reloadApp() }
      icon="check">
      Save
    </StyledButton>
  </React.Fragment>
);

export default SettingsHeader;
