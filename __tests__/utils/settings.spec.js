import { getSetting, setSetting, setBooleanSetting } from 'utils/settings';

describe.skip('UTILS - settings', () => {
  test('should get setting', () => {
    expect(getSetting('color')).toBe('red');
  });

  test('should set setting', () => {
    expect(setSetting('color', 'blue')).toBe('blue');
  });

  test('should set boolean setting', () => {
    expect(setBooleanSetting('color')).toBe('blue');
  });
});
