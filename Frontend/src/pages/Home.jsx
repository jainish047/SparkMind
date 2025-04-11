import { Helmet } from "react-helmet-async";
import DashboardSidebar from "../components/DashboardSidebar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="grid grid-cols-[96px,1fr] h-full w-full">
      <DashboardSidebar />
      <div className="overflow-y-auto overflow-x-hidden border">
        <Outlet />
      </div>
    </div>
  );
}
// No additional code is needed at $PLACEHOLDER$
// The parent container's grid layout and the current structure already ensure the sidebar is fixed
// and the main content is scrollable due to the `overflow-y-auto` class on the main content div.
