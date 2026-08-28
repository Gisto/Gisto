import { RouterProvider, RouteType } from 'dirty-react-router';
import { Suspense, lazy, type ComponentType, type ReactNode } from 'react';

import { ErrorBoundary } from '@/components/error-boundary';
import { MainLayout } from '@/components/layout';
import { Loading } from '@/components/loading.tsx';
import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import ToastManager from '@/components/toast/toast-manager.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';

const DashBoardPage = lazy(() =>
  import('@/components/layout/pages/dashboard').then((module) => ({
    default: module.DashBoard,
  }))
);

const SnippetContentPage = lazy(() =>
  import('@/components/layout/pages/snippet').then((module) => ({
    default: module.SnippetContent,
  }))
);

const CreateNewPage = lazy(() =>
  import('@/components/layout/pages/create-or-edit-snippet').then((module) => ({
    default: module.CreateOrEditSnippet,
  }))
);

const AboutPage = lazy(() =>
  import('@/components/layout/pages/about.tsx').then((module) => ({
    default: module.About,
  }))
);

const SettingsPage = lazy(() =>
  import('@/components/layout/pages/settings').then((module) => ({
    default: module.Settings,
  }))
);

const withErrorBoundary = <T extends Record<string, unknown>>(
  label: string,
  Component: ComponentType<T>
): ((props: T) => ReactNode) => {
  const BoundedRoute = (props: T): ReactNode => (
    <ErrorBoundary label={label}>
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
  BoundedRoute.displayName = `BoundedRoute(${label})`;
  return BoundedRoute;
};

const routes: RouteType[] = [
  {
    path: '/',
    component: withErrorBoundary('dashboard', DashBoardPage),
  },
  {
    path: '/snippets/:id',
    component: withErrorBoundary('snippet', SnippetContentPage),
  },
  {
    path: '/new-snippet',
    component: withErrorBoundary('new-snippet', CreateNewPage),
  },
  {
    path: '/edit/:id',
    component: withErrorBoundary('edit-snippet', CreateNewPage),
  },
  {
    path: '/about',
    component: withErrorBoundary('about', AboutPage),
  },
  {
    path: '/settings',
    component: withErrorBoundary('settings', SettingsPage),
  },
  // {
  //   path: '*',
  //   component: () => <div>404</div>,
  // },
];

export const Gisto = () => {
  return (
    <ThemeProvider>
      <RouterProvider routes={routes}>
        <TooltipProvider>
          <MainLayout />
          <ToastManager />
        </TooltipProvider>
      </RouterProvider>
    </ThemeProvider>
  );
};
