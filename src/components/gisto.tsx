import { RouterProvider, RouteType } from 'dirty-react-router';
import { lazy } from 'react';

import { MainLayout } from '@/components/layout';
import { ThemeProvider } from '@/components/theme/theme-provider.tsx';
import ToastManager from '@/components/toast/toast-manager.tsx';
import { TooltipProvider } from '@/components/ui/tooltip.tsx';
import { Updater } from '@/components/updater.tsx';

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
  import('@/components/layout/pages/about').then((module) => ({
    default: module.About,
  }))
);

const SettingsPage = lazy(() =>
  import('@/components/layout/pages/settings/index.tsx').then((module) => ({
    default: module.Settings,
  }))
);

const routes: RouteType[] = [
  {
    path: '/',
    component: DashBoardPage,
  },
  {
    path: '/snippets/:id',
    component: SnippetContentPage,
  },
  {
    path: '/new-snippet',
    component: CreateNewPage,
  },
  {
    path: '/edit/:id',
    component: CreateNewPage,
  },
  {
    path: '/about',
    component: AboutPage,
  },
  {
    path: '/settings',
    component: SettingsPage,
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
          <Updater />
        </TooltipProvider>
      </RouterProvider>
    </ThemeProvider>
  );
};
