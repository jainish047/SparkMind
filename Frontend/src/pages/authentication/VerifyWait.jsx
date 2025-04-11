import { useDispatch } from "react-redux";
import { resendVerificationEMail } from "../../API/authentication";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyWait() {
  const location = useLocation();
  const { email } = location.state || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resendEmail = async () => {
    console.log("Resending mail for: ", email);
    dispatch(resendVerificationEMail(email))
      .then((response) => {
        console.log(response.data.message);
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            Verify Your Email
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We have sent a verification email to: <br />
            <span className="font-semibold text-gray-800">{email}</span>
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Button>
            <Button className="w-full" onClick={resendEmail}>
              Resend Verification Email
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </>
  );
}
