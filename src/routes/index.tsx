import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import PageLoader from "../components/PageLoader";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const OAuthCallback = lazy(() => import("../pages/OAuthCallback"));
const MyRepositories = lazy(() => import("../pages/MyRepositories"));
const RepositoryDetail = lazy(() => import("../pages/RepositoryDetail"));
const ExplorerUserProfile = lazy(() => import("../pages/ExplorerUserProfile"));

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: withSuspense(<Home />) },
      { path: "/login", element: withSuspense(<Login />) },
      { path: "/auth/callback", element: withSuspense(<OAuthCallback />) },
      { path: "/my-repositories", element: withSuspense(<MyRepositories />) },
      {
        path: "/explore/users/:username",
        element: withSuspense(<ExplorerUserProfile />),
      },
      {
        path: "/repositories/:owner/:repo",
        element: withSuspense(<RepositoryDetail />),
      },
    ],
  },
]);

export default routes;
