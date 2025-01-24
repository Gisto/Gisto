import { Loader } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Loader className="size-8 animate-spin" />
    </div>
  );
};
