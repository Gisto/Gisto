import { useEffect, useState } from 'react';

import { EVENT_NAME } from './index.ts';
import { Toast, ToastType } from './toast.tsx';

import { randomString } from '@/lib/utils';

const ToastManager = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const handleToast = (event: { detail: ToastType }) => {
      const { title, message, type, duration, id } = event.detail;
      const identifier = id ?? randomString(10);

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
    <div
      data-testid="toast-container"
      className="fixed bottom-5 right-5 z-40 transition-all ease-in-out duration-300"
    >
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

export default ToastManager;
