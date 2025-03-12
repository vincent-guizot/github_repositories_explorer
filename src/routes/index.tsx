import { createBrowserRouter } from "react-router-dom";
import Repository from "../components/Repository";
import MainContent from "../components/MainContent";
import Layout from "../layouts/Layout";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children: [
      {
        path: "/",
        element: <MainContent></MainContent>,
      },
      {
        path: "/users/:username/repos",
        element: <Repository></Repository>,
      },
    ],
  },
]);

export default routes;
