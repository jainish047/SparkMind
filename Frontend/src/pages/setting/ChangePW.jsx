import { useState } from "react";
import { Button } from "../../components/ui/button";
import { setPW } from "../../context/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import Loader from "../../components/Loader";

export default function ChangePW() {
  const [password, setPassword] = useState(["", "", ""]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const loading = useSelector((state) => state.loading.loadingStates.resetPW);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      password[0].length === 0 ||
      password[1].length === 0 ||
      password[2].length === 0
    ) {
      setError("Please fill all fields");
      return;
    }

    if (password[1] !== password[2]) {
      setError("Passwords do not match");
      return;
    }

    dispatch(setPW({ currentPassword: password[0], newPassword: password[1] }))
      .unwrap()
      .then((data) => {
        console.log(data);
        toast({
          title: data.message,
        });
        // setTimeout(() => {
        //   navigate("/auth/login");
        // }, 1000);
      })
      .catch((error) => {
        console.log("error result->", error);
        toast({
          variant: "destructive",
          title: error.message,
        });
      });
    setPassword(["", "", ""]);
    setError("");
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4">Change Password</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {" "}
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={password[0]}
            onChange={(e) => {
              setError("");
              setPassword([e.target.value, password[1], password[2]]);
            }}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={password[1]}
            onChange={(e) => {
              setError("");
              setPassword([password[0], e.target.value, password[2]]);
            }}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={password[2]}
            onChange={(e) => {
              setError("");
              setPassword([password[0], password[1], e.target.value]);
            }}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <p className="text-red-500">{error}</p>
        {loading ? (
          <Loader />
        ) : (
          <Button
            type="submit"
            variant="primary"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Change Password
          </Button>
        )}
      </form>
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Make sure to remember your new password!
        </p>
      </div>
    </div>
  );
}
