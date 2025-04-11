import { Link } from "react-router-dom";
export default function PleaseLogin() {
  return (
    <div className="h-full w-full flex justify-center items-center text-4xl">
      <Link to="/auth/login">Login</Link>{" "} Please
    </div>
  );
}
