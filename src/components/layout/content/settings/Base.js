import React from 'react';
import styled from 'styled-components';

import { getSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';
import { baseAppColor } from 'constants/colors';

const Label = styled.div``;

const Small = styled.small`
  font-size: 70%;
  color: ${baseAppColor};
`;

const BaseSettings = () => (
  <div>
    <h4>Color settings:</h4>

    <div>
      <Label>
        Base color:
        <InputColor color={ getSetting('color', '#3F84A8') }
                    onChange={ (event) => setSetting('color', event.target.value) }/>
      </Label>
      <Small><strong>NOTE!</strong> colour change need app reload</Small>
    </div>
  </div>
);

export default BaseSettings;
