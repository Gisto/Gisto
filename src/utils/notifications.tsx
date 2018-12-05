import React from 'react';
import { toast } from 'react-toastify';

import Notification from 'components/common/Notification';

interface INotification {
  title: string;
  body?: string;
  type: string;
  position?: string;
  options?: object;
  actions?: object[];
}

export const setNotification = ({
  title,
  body,
  type,
  position,
  options = { autoClose: 5000 },
  actions = []
}: INotification) => {
  toast[type || 'info'](<Notification title={title} body={body} actions={actions} />, {
    position: position || toast.POSITION.TOP_CENTER,
    ...options
  });
};
