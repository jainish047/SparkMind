import { useState } from "react";
import axios from "axios";

export default function PaymentSetup() {
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifsc: "",
    accountHolderName: "",
  });

  const [projectId, setProjectId] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountDetails((prev) => ({ ...prev, [name]: value }));
  };

  const verifyAndSaveAccount = async () => {
    try {
      const res = await axios.post("/api/verify-account", accountDetails);
      setStatus("Account verified and saved successfully.");
    } catch (err) {
      setStatus("Failed to verify account.");
    }
  };

  const assignFreelancer = async () => {
    try {
      const res = await axios.post(`/api/assign-freelancer/${projectId}`, {
        freelancerId,
        paymentDetails: {}, // dummy or token
      });
      setStatus("Freelancer assigned and payment completed.");
    } catch (err) {
      setStatus("Assignment or payment failed.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Account Verification</h2>
      <input
        type="text"
        name="accountHolderName"
        placeholder="Account Holder Name"
        value={accountDetails.accountHolderName}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="accountNumber"
        placeholder="Account Number"
        value={accountDetails.accountNumber}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="ifsc"
        placeholder="IFSC Code"
        value={accountDetails.ifsc}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={verifyAndSaveAccount}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Verify & Save Account
      </button>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold">Assign Freelancer</h2>
      <input
        type="text"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Freelancer ID"
        value={freelancerId}
        onChange={(e) => setFreelancerId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={assignFreelancer}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Assign & Pay
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
