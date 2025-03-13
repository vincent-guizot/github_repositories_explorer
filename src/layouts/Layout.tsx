import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="w-1/3 mx-auto bg-white rounded-xl shadow my-3 p-4">
      <h1 className="text-2xl font-bold text-center my-3">
        <Link to="/">GitHub Explorer Repositories</Link>
      </h1>
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;
