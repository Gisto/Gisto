import { useState, useEffect } from 'react';

import Toast, { ToastType } from './toast';

const EVENT_NAME = 'gisto-add-toast';

const ToastManager = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const handleToast = (event: { detail: ToastType }) => {
      const { title, message, type, duration, id } = event.detail;
      const identifier = id ?? String(Date.now());

      setToasts((prevToasts) => [
        ...prevToasts,
        { id: identifier, title, message, type, duration },
      ]);
    };

    window.addEventListener(EVENT_NAME, handleToast as unknown as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handleToast as unknown as EventListener);
  }, []);

  const removeToast = (id: string | undefined) => {
    if (!id) {
      console.error('id not specified to onClose');
    }
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 transition-all ease-in-out duration-300">
      {toasts.map((toast, index) => (
        <Toast
          {...toast}
          key={toast.id}
          style={{
            position: 'absolute',
            right: 0,
            bottom: `${index * 80}px`,
          }}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export const toast = {
  show: ({
    message,
    title,
    type = 'default',
    duration = 3000,
    id,
  }: {
    message: string;
    title?: string;
    type?: string;
    duration?: number;
    id?: string;
  }) => {
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { message, type, duration, title, id } })
    );
  },
  info: ({
    message,
    title,
    duration,
    id,
  }: {
    message: string;
    title?: string;
    duration?: number | undefined;
    id?: string;
  }) => toast.show({ message: message, title: title, type: 'info', duration: duration, id: id }),
  warn: ({
    message,
    title,
    duration,
    id,
  }: {
    message: string;
    title?: string;
    duration?: number | undefined;
    id?: string;
  }) => toast.show({ message: message, title: title, type: 'warn', duration: duration, id: id }),
  error: ({
    message,
    title,
    duration,
    id,
  }: {
    message: string;
    title?: string;
    duration?: number | undefined;
    id?: string;
  }) => toast.show({ message: message, title: title, type: 'error', duration: duration, id: id }),
};

export default ToastManager;
