import { motion, AnimatePresence } from 'framer-motion';
import { Info, Rss, Skull, TriangleAlert } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.tsx';
import { cn, upperCaseFirst } from '@/lib/utils.ts';

export type ToastType = {
  title: string;
  message: string;
  type?: 'info' | 'warn' | 'error' | 'notification';
  duration?: number;
  onClose?: () => void;
  id?: string;
  style?: React.CSSProperties;
};

export const Toast = ({
  title,
  message,
  type = 'notification',
  duration = 3000,
  onClose,
  style,
}: ToastType) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const getToastStyle = () => {
    switch (type) {
      case 'warn':
        return 'bg-gradient-to-bl to-50% from-[#f39c12] dark:from-[#f39c12]';
      case 'error':
        return 'bg-gradient-to-bl to-50% from-[#e74c3c] dark:from-[#e74c3c]';
      default:
        return 'bg-gradient-to-bl to-50% from-primary dark:from-primary-950';
    }
  };

  const Icon = ({ className }: { className?: string }) => {
    switch (type) {
      case 'info':
        return <Info className={cn(className, 'stroke-primary')} />;
      case 'warn':
        return <TriangleAlert className={cn(className, 'stroke-[#f39c12]')} />;
      case 'error':
        return <Skull className={cn(className, 'stroke-[#e74c3c]')} />;
      default:
        return <Rss className={cn(className, 'stroke-primary')} />;
    }
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            zIndex: 1000,
            width: 300,
            ...style,
          }}
        >
          <Alert className={cn('text-foreground shadow-md', getToastStyle())}>
            <Icon className={cn('size-4')} />
            <AlertTitle className="font-semibold">{title ?? upperCaseFirst(type)}</AlertTitle>
            <AlertDescription className="font-light">{message}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
