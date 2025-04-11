import { Helmet } from "react-helmet-async";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Explore() {
  const location = useLocation(); // Get the current route
  return (
    <>
      <Helmet>
        <title>Explore</title>
      </Helmet>
      <div className="h-full overflow-y-hidden">
        {/* <header className="flex items-center justify-between py-3 px-6 border-b bg-black shadow-md">
          <nav className="space-x-6 ">
            <Link
              to="freelancers"
              className={`text-white p-1 ${
                location.pathname === "/explore/freelancers"
                  ? "border-b-2 border-white"
                  : ""
              }`}
            >
              Freelancers
            </Link>
            <Link
              to="projects"
              className={`text-white p-1 ${
                location.pathname === "/explore/projects"
                  ? "border-b-2 border-white"
                  : ""
              }`}
            >
              Projects
            </Link>
          </nav>
        </header> */}
        <Outlet />
      </div>
    </>
  );
}
