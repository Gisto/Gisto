import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { keys, map, startCase } from 'lodash/fp';

import { syntaxMap } from 'constants/editor';

import * as uiActions from 'actions/ui';

import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import Input from 'components/common/controls/Input';
import Checkbox from 'components/common/controls/Checkbox';
import Select from 'components/common/controls/Select';
import { isomorphicReload } from 'utils/isomorphic';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledInput = styled(Input)`
  padding: 0 5px;
  width: 148px;
`;

const StyledSelect = styled(Select)`
  width: 158px;
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

const H4 = styled.h4`
  color: ${(props) => props.theme.baseAppColor};
  border-bottom: 1px dashed ${(props) => props.theme.baseAppColor};
  padding-bottom: 20px;
`;

export const SnippetsSettings = ({ changeSettings }) => {
  const updateSettings = (key, value, isBoolean = false) => {
    changeSettings(key, value, false, isBoolean);
    if (isBoolean) {
      setBooleanSetting(key);
    } else {
      setSetting(key, value);
      if (key === 'settings-snippet-order-direction' || key === 'settings-snippet-order-field') {
        isomorphicReload();
      }
    }
  };

  return (
    <div>
      <H4>Snippets settings:</H4>
      <Wrapper>
        <Section>
          <Field>
            <Label>
              <span>Snippet cache (seconds):</span>
              <StyledInput
                type="number"
                title={ `Keep snippet in cache for ${getSetting(
                  'snippet-fetch-cache-in-seconds',
                  100
                )} seconds and do not call the server` }
                value={ getSetting('snippet-fetch-cache-in-seconds', 100) }
                onChange={ (event) =>
                  updateSettings('snippet-fetch-cache-in-seconds', event.target.value)
                }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Snippets polling (seconds):</span>
              <StyledInput
                type="number"
                title={ `Polling the server for new snippets every ${getSetting(
                  'snippets-server-polling-in-seconds',
                  300
                )} seconds` }
                min={ 1 }
                max={ 10000 }
                value={ getSetting('snippets-server-polling-in-seconds', 300) }
                onChange={ (event) =>
                  updateSettings('snippets-server-polling-in-seconds', event.target.value)
                }/>
            </Label>
          </Field>
        </Section>

        <Section>
          <Field>
            <Label>
              <span>Default new snippet language:</span>
              <StyledSelect
                value={ getSetting('setings-default-new-snippet-language', 'Text') }
                onChange={ (event) =>
                  updateSettings('setings-default-new-snippet-language', event.target.value)
                }>
                {map(
                  (language) => (
                    <option value={ language } key={ language }>
                      {language}
                    </option>
                  ),
                  keys(syntaxMap)
                )}
              </StyledSelect>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Default new snippet is public:</span>
              <Checkbox
                checked={ getSetting('defaultNewIsPublic', false) }
                onChange={ () => updateSettings('defaultNewIsPublic', null, true) }/>
            </Label>
          </Field>
        </Section>
      </Wrapper>

      <H4>Snippets order settings:</H4>
      <Wrapper>
        <Section>
          <Field>
            <Label>
              <span>Order field:</span>
              <StyledSelect
                value={ getSetting('settings-snippet-order-field', 'created') }
                onChange={ (event) =>
                  updateSettings('settings-snippet-order-field', event.target.value)
                }>
                {map(
                  (order) => (
                    <option value={ order } key={ order }>
                      {startCase(order)}
                    </option>
                  ),
                  ['created', 'updated', 'description']
                )}
              </StyledSelect>
            </Label>
          </Field>
        </Section>
        <Section>
          <Field>
            <Label>
              <span>Order direction:</span>
              <StyledSelect
                value={ getSetting('settings-snippet-order-direction', 'desc') }
                onChange={ (event) =>
                  updateSettings('settings-snippet-order-direction', event.target.value)
                }>
                {map(
                  (direction) => (
                    <option value={ direction === 'descending' ? 'desc' : 'asc' } key={ direction }>
                      {startCase(direction)}
                    </option>
                  ),
                  ['descending', 'ascending']
                )}
              </StyledSelect>
            </Label>
          </Field>
        </Section>
      </Wrapper>
    </div>
  );
};

SnippetsSettings.propTypes = {
  changeSettings: PropTypes.func
};

export default connect(
  null,
  {
    changeSettings: uiActions.changeSettings
  }
)(SnippetsSettings);
