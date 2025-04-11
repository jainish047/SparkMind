import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Coins, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentAndBudget() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectData = location.state || {}; // Ensure it doesn't crash if state is undefined

  const {
    projectName = "No Project Name",
    description = "No Description",
    skills = [],
    answers = [],
  } = projectData;

  console.log("Received Data:", { projectName, description, skills, answers });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [budget, setBudget] = useState([0, 0]);
  const [error, setError] = useState('');

  const paymentOptions = [
    { value: 'hourly', label: 'Pay by the hour', description: 'Hire based on an hourly rate and pay for hours worked. Best for ongoing projects.' },
    { value: 'fixed', label: 'Pay fixed price', description: 'Agree on a price and release payment when the job is done. Best for one-off tasks.' },
  ];

  // const budgetOptions = [
  //   { value: 'very-small', label: 'Very small project (₹12,500 - ₹37,500 INR)' },
  //   { value: 'small', label: 'Small project (₹37,500 - ₹75,000 INR)' },
  //   { value: 'medium', label: 'Medium project (₹75,000 - ₹150,000 INR)' },
  //   { value: 'large', label: 'Large project (₹150,000+ INR)' },
  // ];

  const currencyOptions = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  // const isNextButtonEnabled = paymentMethod && budget[0] > 0 && budget[1] > 0 && budget[0] <= budget[1];
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
  useEffect(() => {
    if(!paymentMethod || budget[0] === 0 && budget[1] === 0) {
      setIsNextButtonEnabled(false);
      setError('');
    }else if (paymentMethod && budget[0] > 0 && budget[1] > 0 && budget[0] <= budget[1]) {
      setIsNextButtonEnabled(true);
      setError('');
    } else {
      setIsNextButtonEnabled(false);
      setError('Please fill in all required fields correctly.');
    }
  }, [paymentMethod, budget[0], budget[1]]);

  // const selectedBudgetLabel = budgetOptions.find(option => option.value === budget)?.label || 'Not specified';

  const handleNext = () => {
    navigate("/PaymentAndBudget/confirmationPage", {
      state: {
        projectName,
        description,
        answers ,
        skills,
        selectedCurrency,
        // budget: selectedBudgetLabel,
        minBudget: budget[0],
        maxBudget: budget[1],
        paymentMethod,
      },
    });
  };
  return (
    <div className="space-y-8" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 className="text-xl font-semibold">{projectName}</h1>
      <p>{description}</p>

      {/* Payment Method */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">How do you want to pay?</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentOptions.map((option) => (
            <div
              key={option.value}
              className={`relative border rounded-md p-4 cursor-pointer
                         hover:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500
                         ${paymentMethod === option.value ? 'border-pink-500 ring-2 ring-pink-500 bg-pink-50' : 'bg-white'}`}
              onClick={() => setPaymentMethod(option.value)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-500">
                  {option.value === 'hourly' ? <Clock className="w-6 h-6" /> : <Coins className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{option.label}</h3>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Selection */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">What is your estimated budget?</h2>
        <div className="mt-4 flex space-x-4">
          <div className="relative rounded-md shadow-sm flex-grow">
            <select
              className="block w-full py-2.5 pl-3 pr-10 leading-5 text-gray-900 bg-white border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 rounded-md
                         appearance-none sm:text-sm"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {currencyOptions.map((currency) => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          {/* <div className="relative rounded-md shadow-sm flex-grow">
            <select
              className="block w-full py-2.5 pl-3 pr-10 leading-5 text-gray-900 bg-white border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 rounded-md
                         appearance-none sm:text-sm"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            >
              <option value="" disabled>
                Select budget
              </option>
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </div> */}
          <div className='flex gap-2 items-center'>
            <input
              type="number"
              min="0"
              className="block w-full py-2.5 pl-3 pr-10 leading-5 text-gray-900 bg-white border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 rounded-md
                         sm:text-sm"
              placeholder="Minimum budget"
              value={budget[0] || ''}
              onChange={(e) => setBudget([e.target.value, budget[1]])}
            />
            <p>to</p>
            <input
              type="number"
              min="0"
              className="flex justify-between w-full py-2.5 pl-3 pr-10 leading-5 text-gray-900 bg-white border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 rounded-md
                         sm:text-sm"
              placeholder="maximum budget"
              value={budget[1] || ''}
              onChange={(e) => setBudget([budget[0], e.target.value])}
            />
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end items-center gap-2 mt-8">
        {error && <p className="text-red-500 text-sm">{error}</p>}  
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isNextButtonEnabled}
          className={`px-6 py-3 rounded-full text-white font-semibold
                           transition-all duration-300
                           ${isNextButtonEnabled ? 'bg-pink-500 hover:bg-pink-600 shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleNext}
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
