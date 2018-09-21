import React from 'react';
import { toast } from 'react-toastify';

import Notification from 'components/common/Notification';

export const setNotification = ({
  title,
  body,
  type,
  position,
  options = { autoClose: 5000 },
  actions = []
}) => {
  toast[type || 'info'](<Notification title={ title } body={ body } actions={ actions }/>, {
    position: position || toast.POSITION.TOP_CENTER,
    ...options
  });
};
