export const setNotification = (title, body, icon = './icon.png', image = './icon.png') => {
  const options = {
    body,
    icon,
    image
  };

  return new Notification(title, options);
};
