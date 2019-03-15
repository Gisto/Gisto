import React from 'react';
import { toast } from 'react-toastify';

import Notification from 'components/common/Notification';

import { INotification } from 'types/Interfaces.d';

export const setNotification = ({
  title,
  body,
  type,
  position,
  options = { autoClose: 5000 },
  actions = []
}: INotification) => {
  // @ts-ignore
  toast[type || 'info'](<Notification title={title} body={body} actions={actions} />, {
    position,
    ...options
  });
};
