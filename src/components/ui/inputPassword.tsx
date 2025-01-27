import { Eye, EyeClosed } from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const InputPassword = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    const [show, setMask] = useState<boolean>(false);

    return (
      <div className={'relative flex items-center gap-2'}>
        <input
          type={show ? 'text' : 'password'}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            !show && ' tracking-wide',
            className
          )}
          ref={ref}
          {...props}
        />
        {show ? (
          <Eye className="w-4 h-4 cursor-pointer" onClick={() => setMask(false)} />
        ) : (
          <EyeClosed className="w-4 h-4 cursor-pointer" onClick={() => setMask(true)} />
        )}
      </div>
    );
  }
);
InputPassword.displayName = 'InputPassword';

export { InputPassword };
