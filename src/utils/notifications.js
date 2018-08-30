import React from 'react';
import { toast } from 'react-toastify';

import Notification from 'components/common/Notification';

export const setNotification = ({
  title,
  body,
  type,
  position,
  options
}) => {
  toast[type || 'info'](<Notification title={ title } body={ body }/>, {
    position: position || toast.POSITION.TOP_CENTER,
    ...options
  });
};
