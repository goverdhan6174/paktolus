import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { PartialRouteObject } from 'react-router';

import SidebarLayout from 'src/layouts/SidebarLayout';
import BaseLayout from 'src/layouts/BaseLayout';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages
const Game = Loader(lazy(() => import('src/content/game')));

// Applications
const Result = Loader(lazy(() => import('src/content/applications/Result')));
const UserProfile = Loader(
  lazy(() => import('src/content/applications/Users/profile'))
);

// Status
const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);

const routes: PartialRouteObject[] = [
  {
    path: '*',
    element: <BaseLayout />,
    children: [
      {
        path: '*',
        element: <Status404 />
      }
    ]
  },
  {
    path: '*',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="play" replace />
      },
      {
        path: 'play',
        element: <Game />
      }
    ]
  },
  {
    path: 'dashboards',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboards/crypto" replace />
      }
    ]
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/management/result" replace />
      },
      {
        path: 'result',
        element: <Result />
      },
      {
        path: 'profile',
        children: [
          {
            path: '/',
            element: <Navigate to="details" replace />
          },
          {
            path: 'details',
            element: <UserProfile />
          }
        ]
      }
    ]
  }
];

export default routes;
