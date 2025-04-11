import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import PleaseLogin from "../authentication/PleaseLogin";

export function SettingDefault() {
  return (
    <div className="h-full w-full flex justify-center items-center text-4xl">
      Select Setting
    </div>
  );
}

export default function Setting() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const links = [
    // { path: "", label: "Default" },
    { path: "editprofile", label: "Edit Profile" },
    { path: "changepassword", label: "Change Password" },
  ];

  if (!user) {
    return <PleaseLogin />;
  }

  return (
    <div className="border h-full w-full grid grid-cols-12 p-3 gap-3 overflow-hidden">
      <div className="border col-span-2 rounded shadow p-3 flex flex-col gap-3 overflow-y-auto">
        <p className="font-bold text-xl">Settings</p>
        <div className="px-3">
          <nav className="flex flex-col space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `p-1 px-2 rounded-lg transition text-black ${
                    isActive ? "bg-gray-200" : "hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="border col-span-10 rounded shadow p-3 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
