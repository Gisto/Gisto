import React from 'react';
import styled from 'styled-components';

import { getSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';

const Label = styled.div``;

const BaseSettings = () => (
  <div>
    <h4>color settings:</h4>

    <div>
      <Label>
        Base color:
        <InputColor color={ getSetting('color') }
                    onChange={ (event) => setSetting('color', event.target.value) }/>
      </Label>
    </div>
  </div>
);

export default BaseSettings;
