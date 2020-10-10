import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import themeList from 'monaco-themes/themes/themelist';

import * as uiActions from 'actions/ui';

import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

import Input from 'components/common/controls/Input';
import Checkbox from 'components/common/controls/Checkbox';
import Select from 'components/common/controls/Select';
import { toPairs } from 'lodash/fp';

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

const H4 = styled.h4`
  color: ${(props) => props.theme.baseAppColor};
  border-bottom: 1px dashed ${(props) => props.theme.baseAppColor};
  padding-bottom: 20px;
`;

export const EditorSettings = ({ changeSettings }) => {
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
      <H4>Editor settings:</H4>
      <Wrapper>
        <Section>
          <Field>
            <Label>
              <span>Theme:</span>
              <StyledISelect
                value={ getSetting('editorTheme', 'vs') }
                onChange={ (event) => updateSettings('editorTheme', event.target.value) }>
                <option value="vs">vs light</option>
                <option value="vs-dark">vs dark</option>
                <option value="hc-black">hc dark</option>
                {toPairs(themeList).map((theme) => (
                  <option key={ theme[0] } value={ theme[0] }>
                    {theme[1]}
                  </option>
                ))}
              </StyledISelect>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Minimap:</span>
              <Checkbox
                checked={ getSetting('minimap', false) }
                onChange={ () => updateSettings('minimap', null, true) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Code lens:</span>
              <Checkbox
                checked={ getSetting('codeLens', false) }
                onChange={ () => updateSettings('codeLens', null, true) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Line Numbers:</span>
              <Checkbox
                checked={ getSetting('lineNumbers', true) }
                onChange={ () => updateSettings('lineNumbers', null, true) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Format On Paste:</span>
              <Checkbox
                checked={ getSetting('formatOnPaste', true) }
                onChange={ () => updateSettings('formatOnPaste', null, true) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Format On Type:</span>
              <Checkbox
                checked={ getSetting('settings-editor-formatOnType', true) }
                onChange={ () => updateSettings('v', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Select On Line Numbers:</span>
              <Checkbox
                checked={ getSetting('SelectOnLineNumbers', false) }
                onChange={ () => updateSettings('SelectOnLineNumbers', null, true) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Fit editor height to content:</span>
              <Checkbox
                checked={ getSetting('editor-fit-to-content', false) }
                onChange={ () => updateSettings('editor-fit-to-content', null, true) }/>
            </Label>
          </Field>
        </Section>
        <Section>
          <Field>
            <Label>
              <span>Font Family:</span>
              <StyledInput
                type="text"
                value={ getSetting('fontFamily', 'monospace') }
                onChange={ (event) => updateSettings('fontFamily', event.target.value) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Font Size:</span>
              <StyledInput
                type="number"
                value={ getSetting('fontSize', 12) }
                onChange={ (event) => updateSettings('fontSize', event.target.value) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Line height:</span>
              <StyledInput
                type="number"
                value={ getSetting('lineHeight', 21) }
                onChange={ (event) => updateSettings('lineHeight', event.target.value) }/>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Font Ligatures:</span>
              <Checkbox
                checked={ getSetting('fontLigatures', false) }
                onChange={ () => updateSettings('fontLigatures', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Cursor Blinking:</span>
              <StyledISelect
                value={ getSetting('cursorBlinking', 'blink') }
                onChange={ (event) => updateSettings('cursorBlinking', event.target.value) }>
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
              <span>Word wrap:</span>
              <StyledISelect
                value={ getSetting('settings-editor-wordWrap', 'bounded') }
                onChange={ (event) =>
                  updateSettings('settings-editor-wordWrap', event.target.value)
                }>
                <option value="off">off</option>
                <option value="on">on</option>
                <option value="bounded">bounded</option>
                <option value="wordWrapColumn">wordWrapColumn</option>
              </StyledISelect>
            </Label>
          </Field>
          <Field>
            <Label>
              <span>Word wrap column size:</span>
              <StyledInput
                type="number"
                value={ getSetting('settings-editor-wordWrapColumn', 80) }
                onChange={ (event) =>
                  updateSettings('settings-editor-wordWrapColumn', event.target.value)
                }/>
            </Label>
          </Field>
        </Section>
      </Wrapper>

      <H4>Preview settings:</H4>
      <Wrapper>
        <Section>
          <Field>
            <Label>
              <span>Preview HTML files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-html', false) }
                onChange={ () => updateSettings('settings-editor-preview-html', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview Image files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-image', true) }
                onChange={ () => updateSettings('settings-editor-preview-image', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview PDF files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-pdf', true) }
                onChange={ () => updateSettings('settings-editor-preview-pdf', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview Open API/swagger files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-open-api', true) }
                onChange={ () => updateSettings('settings-editor-preview-open-api', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview CSV/TSV files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-csv', true) }
                onChange={ () => updateSettings('settings-editor-preview-csv', null, true) }/>
            </Label>
          </Field>
        </Section>

        <Section>
          <Field>
            <Label>
              <span>Preview GeoJSON:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-geojson', true) }
                onChange={ () => updateSettings('settings-editor-preview-geojson', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview Markdown files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-markdown', true) }
                onChange={ () => updateSettings('settings-editor-preview-markdown', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview AsciiDoc files:</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-asciidoc', true) }
                onChange={ () => updateSettings('settings-editor-preview-asciidoc', null, true) }/>
            </Label>
          </Field>

          <Field>
            <Label>
              <span>Preview LaTex files (using katex):</span>
              <Checkbox
                checked={ getSetting('settings-editor-preview-latex', true) }
                onChange={ () => updateSettings('settings-editor-preview-latex', null, true) }/>
            </Label>
          </Field>
        </Section>
      </Wrapper>
    </div>
  );
};

EditorSettings.propTypes = {
  changeSettings: PropTypes.func
};

export default connect(
  null,
  {
    changeSettings: uiActions.changeSettings
  }
)(EditorSettings);
