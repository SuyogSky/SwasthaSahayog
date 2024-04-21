import React, { useEffect } from 'react';

const MedicineRemainder = () => {
  useEffect(() => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
    } else {
      // Check if permission is already granted
      if (Notification.permission === 'granted') {
        // If it's okay let's create a notification
        showNotification();
      } else if (Notification.permission !== 'denied') {
        // Otherwise, we need to ask the user for permission
        Notification.requestPermission().then(function (permission) {
          // If the user accepts, let's create a notification
          if (permission === 'granted') {
            showNotification();
          }
        });
      }
    }
  }, []); // empty array ensures this effect runs only once, similar to componentDidMount

  const showNotification = () => {
    new Notification('Welcome!', {
      body: 'Thank you for visiting!',
    });
  };

  return (
    <div>
      <h1>Welcome to the Push Notification Component!</h1>
      <p>This component displays a push notification when it loads for the first time.</p>
    </div>
  );
};

export default MedicineRemainder;
