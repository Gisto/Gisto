import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { badgeVariants } from '@/components/ui/badge-variants.ts';
import { cn } from '@/utils';

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
