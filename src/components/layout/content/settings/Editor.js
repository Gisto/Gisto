import React from 'react';
import { getSetting, setBooleanSetting, setSetting } from 'utils/settings';

const EditorSettings = () => (
  <div>
    <h4>editor settings:</h4>
    <p>
      <label>
        Theme:
        <select value={ getSetting('editorTheme') }
                onChange={ (event) => setSetting('editorTheme', event.target.value) }>
          <option value="vs">vs light</option>
          <option value="vs-dark">vs dark</option>
          <option value="hc-black">hc dark</option>
        </select>
      </label>
    </p>
    <p>
      <label>
        Minimap:
        <input type="checkbox"
               defaultChecked={ getSetting('minimap') }
               onChange={ () => setBooleanSetting('minimap') }/>
      </label>
    </p>
    <p>
      <label>
        Line Numbers:
        <input type="checkbox"
               defaultChecked={ getSetting('lineNumbers') }
               onChange={ () => setBooleanSetting('lineNumbers') }/>
      </label>
    </p>
    <p>
      <label>
        Code lens:
        <input type="checkbox"
               defaultChecked={ getSetting('codeLens') }
               onChange={ () => setBooleanSetting('codeLens') }/>
      </label>
    </p>
    <p>
      <label>
        Cursor Blinking:
        <select value={ getSetting('cursorBlinking') }
                onChange={ (event) => setSetting('cursorBlinking', event.target.value) }>
          <option value="blink">blink</option>
          <option value="smooth">smooth</option>
          <option value="phase">phase</option>
          <option value="expand">expand</option>
          <option value="solid">solid</option>
        </select>
      </label>
    </p>
    <p>
      <label>
        Select On Line Numbers:
        <input type="checkbox"
               defaultChecked={ getSetting('selectOnLineNumbers') }
               onChange={ () => setBooleanSetting('selectOnLineNumbers') }/>
      </label>
    </p>
  </div>
);

export default EditorSettings;
