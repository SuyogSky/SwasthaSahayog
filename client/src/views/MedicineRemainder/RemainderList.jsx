// ReminderList.js
import React from 'react';

const ReminderList = ({ reminders }) => {
  return (
    <div>
      <h2>Reminders</h2>
      <ul>
        {reminders.map((reminder, index) => (
          <li key={index}>
            {reminder.time} - {reminder.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
