import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons
import { Button } from "@/components/ui/button"; // adjust path based on your project structure

const GoogleButton = ({ onClick }) => {
  const handleGoogleLogin = () => {
    // Redirect the user to your backend's Google OAuth endpoint.
    window.location.href = "http://localhost:3000/api/auth/google";
  };
  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center gap-3 w-full p-3 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <FcGoogle className="w-5 h-5" />
      <span className="font-medium text-sm">Continue with Google</span>
    </button>
  );
};

export default function Auth() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
          <GoogleButton />
          <div className="flex items-center my-2 text-gray-400">
            <hr className="flex-grow" />
            <span className="mx-2 text-gray-600">or</span>
            <hr className="flex-grow" />
          </div>
          <Outlet />
        </div>
      </div>
      <Toaster />
    </>
  );
}
