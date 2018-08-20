import React from 'react';
import { getSetting, setSetting } from 'utils/settings';

import InputColor from 'components/common/controls/InputColor';

const BaseSettings = () => (
  <div>
    <h4>color settings:</h4>

    <p>
      <label>
        Base color:
        <InputColor color={ getSetting('color') }
                    onChange={ (event) => setSetting('color', event.target.value) }/>
      </label>
    </p>
  </div>
);

export default BaseSettings;
