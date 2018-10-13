import React from 'react';
import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import styled from 'styled-components';

import Input from 'components/common/controls/Input';
import Checkbox from 'components/common/controls/Checkbox';
import Select from 'components/common/controls/Select';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
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

const Field = styled.div`
  height: 35px;
`;

const StyledInput = styled(Input)`
  padding: 0 5px;
  width: 148px;
`;

const StyledISelect = styled(Select)`
  width: 158px;
`;

const EditorSettings = () => (
  <div>
    <h4>Editor settings:</h4>
    <Wrapper>
      <Section>
        <Field>
          <Label>
            <span>Theme:</span>
            <StyledISelect value={ getSetting('editorTheme', 'vs') }
                           onChange={ (event) => setSetting('editorTheme', event.target.value) }>
              <option value="vs">vs light</option>
              <option value="vs-dark">vs dark</option>
              <option value="hc-black">hc dark</option>
            </StyledISelect>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Minimap:</span>
            <Checkbox checked={ getSetting('minimap', false) }
                      onChange={ () => setBooleanSetting('minimap') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Line Numbers:</span>
            <Checkbox checked={ getSetting('lineNumbers', true) }
                      onChange={ () => setBooleanSetting('lineNumbers') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Format On Paste:</span>
            <Checkbox checked={ getSetting('formatOnPaste', true) }
                      onChange={ () => setBooleanSetting('formatOnPaste') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Font Family:</span>
            <StyledInput type="text"
                   value={ getSetting('fontFamily', 'monospace') }
                   onChange={ (event) => setSetting('fontFamily', event.target.value) }/>
          </Label>
        </Field>
      </Section>
      <Section>
        <Field>
          <Label>
            <span>Font Size:</span>
            <StyledInput type="number"
                   value={ getSetting('fontSize', 12) }
                   onChange={ (event) => setSetting('fontSize', event.target.value) }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Line height:</span>
            <StyledInput type="number"
                   value={ getSetting('lineHeight', 21) }
                   onChange={ (event) => setSetting('lineHeight', event.target.value) }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Font Ligatures:</span>
            <Checkbox checked={ getSetting('fontLigatures', false) }
                      onChange={ () => setBooleanSetting('fontLigatures') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Code lens:</span>
            <Checkbox checked={ getSetting('codeLens', false) }
                      onChange={ () => setBooleanSetting('codeLens') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Cursor Blinking:</span>
            <StyledISelect value={ getSetting('cursorBlinking', 'blink') }
                           onChange={ (event) => setSetting('cursorBlinking', event.target.value) }>
              <option value="blink">blink</option>
              <option value="smooth">smooth</option>
              <option value="phase">phase</option>
              <option value="expand">expand</option>
              <option value="solid">solid</option>
            </StyledISelect>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Select On Line Numbers:</span>
            <Checkbox checked={ getSetting('SelectOnLineNumbers', false) }
                      onChange={ () => setBooleanSetting('SelectOnLineNumbers') }/>
          </Label>
        </Field>
      </Section>
    </Wrapper>
  </div>
);

export default EditorSettings;
