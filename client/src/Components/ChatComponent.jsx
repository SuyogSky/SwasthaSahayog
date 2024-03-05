import React, { useState, useEffect } from 'react';
import ip_websocket from '../ip_websocket';

const ChatComponent = ({ senderId, receiverId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  // useEffect(() => {
  //   // Open a WebSocket connection when the component mounts
  //   const socket = new WebSocket(`ws://${ip_websocket}/ws/chat/${31}/${30}/`);

  //   socket.onopen = () => {
  //     console.log('WebSocket connection opened');
  //     setWs(socket);
  //   };

  //   socket.onmessage = (event) => {
  //     // Handle incoming messages
  //     const data = JSON.parse(event.data);
  //     setChatHistory((prevChatHistory) => [...prevChatHistory, data]);
  //   };

  //   socket.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };

  //   // Close the WebSocket connection when the component unmounts
  //   return () => {
  //     if (ws) {
  //       ws.close();
  //     }
  //   };
  // }, [senderId, receiverId]);



  useEffect(() => {
    
    var ws = new WebSocket(`ws://${ip_websocket}/ws/chat/30/31/`);
    setWs(ws)
    ws.onopen = function () {
      console.log('WebSocket connection established');
      ws.send(
        JSON.stringify(
          {
            "command": "Say hello !",
            "data_string": "This is the data string !",
          }
        )
      );
    };

    ws.onerror = function (error) {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        console.log(data.message)
      }
    };

    return () => {
      // Cleanup: Close the WebSocket connection when the component is unmounted
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    console.log(ws)
    if (ws && message.trim() !== '') {
      const data = {
        message,
        sender: senderId,
        receiver: receiverId,
      };
      ws.send(JSON.stringify(data));
      setMessage('');
    }
  };

  return (
    <div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <strong>{chat.sender}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
