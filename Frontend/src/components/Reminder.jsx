import React, { useState } from 'react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  
  const handleAddReminder = () => {
    if (description && dateTime) {
      const newReminder = { description, dateTime };
      setReminders([...reminders, newReminder]);
      setDescription('');
      setDateTime('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full">
      {/* Input fields for reminder description and date/time */}
      <div className="mb-4">
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Reminder Description" 
          className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input 
          type="datetime-local" 
          value={dateTime} 
          onChange={(e) => setDateTime(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={handleAddReminder}
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Reminder
        </button>
      </div>

      {/* Display reminders */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Reminders:</h3>
        <ul>
          {reminders.map((reminder, index) => (
            <li key={index} className="mb-2 p-2 border border-gray-200 rounded-md bg-gray-50">
              <strong className="font-medium">Description:</strong> {reminder.description} <br />
              <strong className="font-medium">Time:</strong> {new Date(reminder.dateTime).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reminders;