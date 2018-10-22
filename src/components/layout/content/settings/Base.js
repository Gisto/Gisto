import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { debounce } from 'lodash/fp';
import styled from 'styled-components';

import * as uiActions from 'actions/ui';
import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';
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

const Field = styled.div`
  height: ${(props) => props.height ? props.height : 35}px;
`;

export const BaseSettings = ({ changeSettings }) => {
  const updateSettings = (key, value, isTheme, isBoolean = false) => {
    changeSettings(key, value, isTheme, isBoolean);
    if (isBoolean) {
      setBooleanSetting(key);
    } else {
      setSetting(key, value);
    }
  };

  const updateSettingsThrottled = debounce(100, updateSettings);

  return (
    <div>
      <h4>Color settings:</h4>

      <Section>
        <Field height={ 55 }>
          <Label>
            <span>Base color:</span>
            <InputColor color={ getSetting('color', '#3F84A8') }
                        onChange={ (event) => updateSettingsThrottled('color', event.target.value, true) }/>
          </Label>
        </Field>

        <Field>
          <Label>
            <span>Show API rate limit on header:</span>
            <Checkbox checked={ getSetting('settings-show-api-rate-limit', true) }
                      onChange={ () => updateSettings('settings-show-api-rate-limit', null, null, true) }/>
          </Label>
        </Field>

      </Section>
    </div>
  );
};

BaseSettings.propTypes = {
  changeSettings: PropTypes.func
};

export default connect(null, {
  changeSettings: uiActions.changeSettings
})(BaseSettings);
