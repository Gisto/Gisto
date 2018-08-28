import React from 'react';
import styled from 'styled-components';

import { isomorphicReload } from 'utils/isomorphic';

import Button from 'components/common/controls/Button';

const StyledButton = styled(Button)`
  margin-right: 10px;
`;

const SettingsHeader = () => (
  <React.Fragment>
    <div>Settings</div>
    <StyledButton
      onClick={ () => isomorphicReload() }
      icon="check">
      Save
    </StyledButton>
  </React.Fragment>
);

export default SettingsHeader;
