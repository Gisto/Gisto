import React from 'react';
import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Section = styled.div`
  width: 33%;
`;

const Field = styled.div`
  height: 35px;
`;

const EditorSettings = () => (
  <div>
    <h4>editor settings:</h4>
    <Wrapper>
      <Section>
        <Field>
          <Label>
            <span>Theme:</span>
            <select value={ getSetting('editorTheme') }
                    onChange={ (event) => setSetting('editorTheme', event.target.value) }>
              <option value="vs">vs light</option>
              <option value="vs-dark">vs dark</option>
              <option value="hc-black">hc dark</option>
            </select>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Minimap:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('minimap') }
                   onChange={ () => setBooleanSetting('minimap') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Line Numbers:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('lineNumbers') }
                   onChange={ () => setBooleanSetting('lineNumbers') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Format On Paste:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('formatOnPaste') }
                   onChange={ () => setBooleanSetting('formatOnPaste') }/>
          </Label>
        </Field>
      </Section>
      <Section>
        <Field>
          <Label>
            <span>Font Family:</span>
            <input type="text"
                   defaultValue={ getSetting('fontFamily', 'fira code') }
                   onChange={ (event) => setSetting('fontFamily', event.target.value) }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Font Size:</span>
            <input type="number"
                   defaultValue={ getSetting('fontSize', 12) }
                   onChange={ (event) => setSetting('fontSize', event.target.value) }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Line height:</span>
            <input type="number"
                   defaultValue={ getSetting('lineHeight', 21) }
                   onChange={ (event) => setSetting('lineHeight', event.target.value) }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Font Ligatures:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('fontLigatures', false) }
                   onChange={ () => setBooleanSetting('fontLigatures') }/>
          </Label>
        </Field>
      </Section>
      <Section>
        <Field>
          <Label>
            <span>Code lens:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('codeLens') }
                   onChange={ () => setBooleanSetting('codeLens') }/>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Cursor Blinking:</span>
            <select value={ getSetting('cursorBlinking') }
                    onChange={ (event) => setSetting('cursorBlinking', event.target.value) }>
              <option value="blink">blink</option>
              <option value="smooth">smooth</option>
              <option value="phase">phase</option>
              <option value="expand">expand</option>
              <option value="solid">solid</option>
            </select>
          </Label>
        </Field>
        <Field>
          <Label>
            <span>Select On Line Numbers:</span>
            <input type="checkbox"
                   defaultChecked={ getSetting('selectOnLineNumbers') }
                   onChange={ () => setBooleanSetting('selectOnLineNumbers') }/>
          </Label>
        </Field>
      </Section>
    </Wrapper>
  </div>
);

export default EditorSettings;
