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
      <H4>GitLab settings:</H4>
      <Wrapper>
        <Section>
          <Field>
            <Label>
              <span>GitLab token:</span>
              <StyledInput type="text" title="GitLab token" onChange={ (event) => null }/>
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
