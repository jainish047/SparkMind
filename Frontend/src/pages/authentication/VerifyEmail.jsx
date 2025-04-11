import { useEffect, useState } from "react";
import axios from "axios";

export default function VerifyEmail() {
  const [message, setMessage] = useState("Please wait...");

  useEffect(() => {
    const fxn = async () => {
      try {
        // Get the current URL
        const url = new URL(window.location.href);

        // Get the query string parameters
        const params = new URLSearchParams(url.search);

        // Retrieve individual parameters
        const token = params.get("token");

        // Make the API call
        const response = await axios.post(
          "http://localhost:3000/api/auth/verifyEmail",
          { token }
        );
        setMessage("Email verified. You may now login");
      } catch (error) {
        setMessage(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } 
    };

    fxn();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <p>{message}</p>
    </div>
  );
}
