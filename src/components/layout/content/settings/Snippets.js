import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as uiActions from 'actions/ui';

import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import Input from 'components/common/controls/Input';
import Checkbox from 'components/common/controls/Checkbox';

const StyledInput = styled(Input)`
  padding: 0 5px;
  width: 148px;
`;

const Field = styled.div`
  height: 35px;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 10px;
`;

const Section = styled.div`
  width: 45%;
`;

export const SnippetsSettings = ({ changeSettings }) => {
  const updateSettings = (key, value, isBoolean = false) => {
    changeSettings(key, value, false, isBoolean);
    if (isBoolean) {
      setBooleanSetting(key);
    } else {
      setSetting(key, value);
    }
  };

  return (
    <div>
      <h4>Snippets settings:</h4>

      <Section>
        <Field>
          <Label>
            <span>Snippet cache (seconds):</span>
            <StyledInput type="number"
                         title="Keep snippet in cache for N seconds and do not call the server"
                         value={ getSetting('snippet-fetch-cache-in-seconds', 100) }
                         onChange={ (event) => updateSettings('snippet-fetch-cache-in-seconds', event.target.value) }/>
          </Label>
        </Field>

        <Field>
          <Label>
            <span>Snippets polling (seconds):</span>
            <StyledInput type="number"
                         title="Polling the server for new snippets every N seconds"
                         min={ 1 }
                         max={ 10000 }
                         value={ getSetting('snippets-server-polling-in-seconds', 300) }
                         onChange={ (event) => updateSettings('snippets-server-polling-in-seconds', event.target.value) }/>
          </Label>
        </Field>

        <Field>
          <Label>
            <span>Default new snippet is public:</span>
            <Checkbox checked={ getSetting('defaultNewIsPublic', false) }
                      onChange={ () => updateSettings('defaultNewIsPublic', null, true) }/>
          </Label>
        </Field>
      </Section>
    </div>
  );
};

SnippetsSettings.propTypes = {
  changeSettings: PropTypes.func
};

export default connect(null, {
  changeSettings: uiActions.changeSettings
})(SnippetsSettings);
