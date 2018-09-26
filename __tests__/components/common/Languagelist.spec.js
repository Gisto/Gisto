import { Languagelist } from 'components/common/Languagelist';
import React from 'react';

const setup = () => shallow(
  <Languagelist>
    <div>
      <span>HTML</span>
      <br/>
      <strong>42</strong>
      <small>files</small>
    </div>
  </Languagelist>
);

describe('COMPONENTS - <Languagelist>', () => {
  test('render Languagelist', () => {
    const component = setup();

    expect(component).toMatchSnapshot();
  });
});
