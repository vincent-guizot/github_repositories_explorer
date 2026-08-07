import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import MyRepositories from "../pages/MyRepositories";
import RepositoryDetail from "../pages/RepositoryDetail";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/my-repositories", element: <MyRepositories /> },
      { path: "/repositories/:owner/:repo", element: <RepositoryDetail /> },
    ],
  },
]);

export default routes;
