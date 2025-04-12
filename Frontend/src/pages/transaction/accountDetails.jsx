import { useEffect, useState } from 'react';
import {api} from '../../API/axiosConfig.js';

export default function BankAccountForm({ userId }) {
  const [form, setForm] = useState({
    accountNo: '',
    ifsc: '',
    bankName: '',
    upiId: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/bank-account/${userId}`);
        if (res.data) setForm(res.data);
      } catch (err) {
        console.log("No previous details");
      }
    };
    fetch();
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bank-account', { ...form, userId });
      setStatus("Saved ✅");
    } catch (err) {
      setStatus("Failed ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Bank Account Details</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="accountNo" value={form.accountNo} onChange={handleChange} placeholder="Account Number" className="w-full border px-3 py-2 rounded" />
        <input name="ifsc" value={form.ifsc} onChange={handleChange} placeholder="IFSC Code" className="w-full border px-3 py-2 rounded" />
        <input name="bankName" value={form.bankName} onChange={handleChange} placeholder="Bank Name" className="w-full border px-3 py-2 rounded" />
        <input name="upiId" value={form.upiId} onChange={handleChange} placeholder="UPI ID (optional)" className="w-full border px-3 py-2 rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}
