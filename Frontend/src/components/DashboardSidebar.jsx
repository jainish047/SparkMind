import {
  Home,
  Briefcase,
  List,
  ClipboardList,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full w-full p-4 bg-white text-gray-700 flex flex-col items-center border-r shadow-sm">
      <nav className="space-y-6 text-gray-500 text-center">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Home
            className={`w-6 h-6 ${
              isActive("/") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${isActive("/") ? "text-blue-500" : ""}`}
          >
            Home
          </span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/lists")}
        >
          <List
            className={`w-6 h-6 ${
              isActive("/lists") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              isActive("/lists") ? "text-blue-500" : ""
            }`}
          >
            Lists
          </span>
        </div>

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/projects")}
        >
          <Briefcase
            className={`w-6 h-6 ${
              isActive("/projects") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              isActive("/projects") ? "text-blue-500" : ""
            }`}
          >
            Projects
          </span>
        </div>

        {/* <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/projectUpdates")}
        >
          <ClipboardList
            className={`w-6 h-6 ${
              isActive("/projectUpdates") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              isActive("/projectUpdates") ? "text-blue-500" : ""
            }`}
          >
            Updates
          </span>
        </div> */}

        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/chat")}
        >
          <MessageSquare
            className={`w-6 h-6 ${
              isActive("/chat") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              isActive("/chat") ? "text-blue-500" : ""
            }`}
          >
            Chat
          </span>
        </div>

        {/* <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <Bell
            className={`w-6 h-6 ${
              isActive("/notification") ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              isActive("/notification") ? "text-blue-500" : ""
            }`}
          >
            Notifications
          </span>
        </div> */}
      </nav>
    </div>
  );
}
