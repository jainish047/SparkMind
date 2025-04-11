import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { sendForgotPWEmail } from "../../context/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

export default function ForgotPW() {
  // const { email } = location.state || {};
  const [email, setEmail] = useState("");
  const isLoading = useSelector(
    (state) => state.loading.loadingStates.resendEmail
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sendEmail = async () => {
    console.log("sending forgotpw mail for: ", email);
    dispatch(sendForgotPWEmail(email))
      .unwrap()
      .then((data) => {
        console.log(data.message);
        toast.success(data.message);
      })
      .catch((error) => {
        console.log(error?.message);
        toast.error(error?.message);
      });
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Enter Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We will send you a link to reset your password.
          </p>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="abc123@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <Loader />
            ) : (
              <Button type="submit" className="w-full" onClick={sendEmail}>
                Send Email
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
}
