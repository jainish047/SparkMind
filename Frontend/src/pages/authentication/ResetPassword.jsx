import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetPW } from "../../context/authSlice";

export default function ResetPW() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState(["", ""]);
  const [pwVisibility, setPWVisibility] = useState([false, false]);
  const isLoading = useSelector(
    (state) => state.loading.loadingStates.resendEmail
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fxn = async () => {
      try {
        // Get the current URL
        const url = new URL(window.location.href);

        // Get the query string parameters
        const params = new URLSearchParams(url.search);

        // Retrieve individual parameters
        const token = params.get("token");
        setToken(token);
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    };

    fxn();
  }, []);

  async function handleResetPWClick() {
    if (password[0] !== password[1]) {
      setMessage("Passwords must match");
      return;
    }
    dispatch(resetPW({ password: password[0], token }))
      .unwrap()
      .then((data) => {
        console.log(data.message);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(error.message);
      });
  }

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-sm text-left">
            <label htmlFor="password">Password</label>
            <div className="flex justify-around items-center gap-2">
              <Input
                type={pwVisibility[0] ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                value={password[0]}
                onChange={(e) => {
                  setMessage("");
                  setPassword([e.target.value, password[1]]);
                }}
              />
              <span
                onClick={() =>
                  setPWVisibility([!pwVisibility[0], pwVisibility[1]])
                }
              >
                {pwVisibility[0] ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          <div className="text-sm text-left">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="flex justify-around items-center gap-2">
              <Input
                type={pwVisibility[1] ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                value={password[1]}
                onChange={(e) => {
                  setMessage("");
                  setPassword([password[0], e.target.value]);
                }}
              />
              <span
                onClick={() =>
                  setPWVisibility([pwVisibility[0], !pwVisibility[1]])
                }
              >
                {pwVisibility[1] ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>
          <p className="text-red-600">{message}</p>
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className="w-full"
                onClick={handleResetPWClick}
              >
                Set Password
              </Button>
            )}
            {/* <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button> */}
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
}
