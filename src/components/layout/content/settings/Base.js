import React from 'react';
import styled from 'styled-components';

import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';
import { baseAppColor } from 'constants/colors';
import Checkbox from 'components/common/controls/Checkbox';

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 10px;
`;

const Section = styled.div`
  width: 45%;
`;

const Small = styled.small`
  font-size: 70%;
  color: ${baseAppColor};
`;

const Field = styled.div`
  height: ${(props) => props.height ? props.height : 35}px;
`;

const BaseSettings = () => (
  <div>
    <h4>Color settings:</h4>

    <Section>
      <Field height={ 55 }>
        <Label>
          <span>Base color:</span>
          <InputColor color={ getSetting('color', '#3F84A8') }
                    onChange={ (event) => setSetting('color', event.target.value) }/>
        </Label>
        <Small><strong>NOTE!</strong> color change need app reload</Small>
      </Field>

      <Field>
        <Label>
          <span>Show API rate limit on header:</span>
          <Checkbox checked={ getSetting('settings-show-api-rate-limit', true) }
                  onChange={ () => setBooleanSetting('settings-show-api-rate-limit') }/>
        </Label>
      </Field>

    </Section>
  </div>
);

export default BaseSettings;
