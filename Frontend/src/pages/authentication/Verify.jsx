import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function Verify() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
