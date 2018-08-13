import React from 'react';
import { getSetting, setSetting } from 'utils/settings';

const BaseSettings = () => (
  <div>
    <h4>color settings:</h4>

    <p>
      <label>
        Base color:
        <input type="color"
               defaultValue={ getSetting('color') }
               onChange={ (event) => setSetting('color', event.target.value) }/>
      </label>
    </p>
  </div>
);

export default BaseSettings;
