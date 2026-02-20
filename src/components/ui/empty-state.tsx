import { cn } from '@/utils';
interface EmptyStateProps {
  className?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ className, title, description, action }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <div>{`{ G }`}</div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};
