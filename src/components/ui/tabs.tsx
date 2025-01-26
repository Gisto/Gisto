'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';
import { cloneElement, isValidElement } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ChildProps {
  variant?: 'line' | 'pill';
}

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & ChildProps
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  const childrenWithEnhancedProps = React.Children.map(props.children, (child) => {
    if (isValidElement(child)) {
      const childProps = child.props as ChildProps;
      return cloneElement(child as React.ReactElement<ChildProps>, {
        ...childProps,
        variant: props.variant,
      });
    }

    return child;
  });

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        props?.variant === 'line' &&
          'inline-flex w-full !items-center !justify-start !p-0 bg-transparent rounded-none gap-0 border-b-2 border-border text-muted-foreground mb-4',
        props?.variant !== 'line' &&
          isMobile &&
          'flex items-center justify-start flex-wrap h-auto space-y-1',
        className
      )}
      {...props}
    >
      {childrenWithEnhancedProps}
    </TabsPrimitive.List>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: 'line' | 'pill';
  }
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        props?.variant === 'line' &&
          'mx-2 -mb-[2px] rounded-none shadow-none inline-flex items-center justify-start  whitespace-nowrap border-b-2 px-2 py-2 text-base font-medium transition-all first-of-type:ml-0 disabled:pointer-events-none disabled:text-muted-foreground data-[state=active]:border-primary data-[state=inactive]:border-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold data-[state=active]:text-foreground',
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
