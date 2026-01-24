import { Loader } from 'lucide-react';

type LoadingProps = {
  message?: string;
  className?: string;
  size?: number;
};

export const Loading = ({ message, className, size = 8 }: LoadingProps) => {
  return (
    <div className={className || 'flex flex-col justify-center items-center w-full h-screen'}>
      <Loader className={`size-${size} animate-spin`} />
      {message && <div className="mt-4">{message}</div>}
    </div>
  );
};
