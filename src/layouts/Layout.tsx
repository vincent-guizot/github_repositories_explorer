import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">GitHub User Search</h1>
      <Outlet></Outlet>
    </div>
  );
};

export default Layout;
