export const EVENT_NAME = 'gisto-add-toast';

export const toast = {
  show: ({
    message,
    title,
    type = 'info',
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
