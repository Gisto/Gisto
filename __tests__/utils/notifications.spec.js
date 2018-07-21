import { setNotification } from 'utils/notifications';

describe('UTILS - notifications', () => {

  window.Notification = () => ({
    onShow: 'just checking its called'
  });

  test('should send notification', () => {
    expect(setNotification('hello')).toEqual({
      onShow: 'just checking its called'
    });
  });
});
