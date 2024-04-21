// ReminderForm.js
import React, { useState } from 'react';

const ReminderForm = ({ onAddReminder }) => {
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const reminder = { time, description };
    onAddReminder(reminder);
    setTime('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Add Reminder</button>
    </form>
  );
};

export default ReminderForm;
