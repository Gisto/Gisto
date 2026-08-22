import * as Sentry from '@sentry/react';
import { TriangleAlert } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';

interface ErrorBoundaryProps {
  children: ReactNode;
  label?: string;
  fallback?: (error: Error, resetErrorBoundary: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const scope = this.props.label ? ` (${this.props.label})` : '';
    console.error(`[ErrorBoundary]${scope} Caught rendering error:`, error, info.componentStack);
    Sentry.captureException(error, {
      extra: { componentStack: info.componentStack ?? '', boundary: this.props.label },
    });
  }

  resetErrorBoundary = () => {
    this.setState({ error: null });
  };

  goHome = () => {
    window.location.assign('/');
  };

  render() {
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback(error, this.resetErrorBoundary);
    }

    return (
      <div className="border-r border-collapse h-screen w-full min-w-0 flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <TriangleAlert className="text-destructive size-6" />
        </div>
        <div className="flex max-w-md flex-col gap-1.5">
          <h2 className="font-semibold text-foreground text-lg">
            {t('components.errorBoundaryTitle')}
          </h2>
          <p className="text-muted-foreground text-sm">{t('components.errorBoundaryDescription')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={this.resetErrorBoundary}>{t('common.retry')}</Button>
          <Button variant="outline" onClick={this.goHome}>
            {t('components.errorBoundaryBackHome')}
          </Button>
        </div>
        {import.meta.env.DEV && (
          <details className="w-full max-w-2xl text-left">
            <summary className="cursor-pointer text-muted-foreground text-xs transition-colors hover:text-foreground">
              {t('components.errorBoundaryDetails')}
            </summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded-md border bg-muted p-3 font-mono text-muted-foreground text-xs whitespace-pre-wrap">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
