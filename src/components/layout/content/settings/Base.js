import React from 'react';
import styled from 'styled-components';

import { getSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';
import Input from 'components/common/controls/Input';

const Label = styled.div``;

const StyledInput = styled(Input)`
  padding: 0 5px;
  width: 148px;
`;

const BaseSettings = () => (
  <div>
    <h4>Color settings:</h4>

    <div>
      <Label>
        Base color:
        <InputColor color={ getSetting('color') }
                    onChange={ (event) => setSetting('color', event.target.value) }/>
      </Label>
    </div>

    <h4>General settings:</h4>

    <div>
      <Label>
        <span>Snippet cache (seconds):</span>
        <StyledInput type="number"
                     value={ getSetting('snippet-fetch-cache-in-seconds', 100) }
                     onChange={ (event) => setSetting('snippet-fetch-cache-in-seconds', event.target.value) }/>
      </Label>
    </div>
  </div>
);

export default BaseSettings;
