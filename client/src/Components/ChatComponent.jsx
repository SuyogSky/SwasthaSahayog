import React, { useState, useEffect } from 'react';
import ip_websocket from '../ip_websocket';
import ip from '../ip';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';

const ChatComponent = ({ senderId, receiverId }) => {
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const baseUrl = `${ip}/chat`
  const axios = useAxios()

  const token = localStorage.getItem("authTokens")
  const decoded = jwtDecode(token)
  const user_id = decoded.user_id

  const reveiverr = user_id == 30 ? 31 : 30

  const getChatHistory = () => {
    alert('sender is: ', user_id, '\n', 'receiver is: ', reveiverr)
    try {
      axios.get(baseUrl + '/get-messages/' + user_id + '/' + reveiverr + '/').then((res) => {
        setChatHistory(res.data)
        console.log('mess: ', res.data)
      })
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getChatHistory()
  }, [])

  useEffect(() => {
    // Open a WebSocket connection when the component mounts
    const socket = new WebSocket(`ws://${ip_websocket}/ws/chat/${user_id}/${reveiverr}/`);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setWs(socket);
    };

    socket.onmessage = (event) => {
      // Handle incoming messages
      const data = JSON.parse(event.data);
      console.log(data)

      if (data.image) {
        const imageBase64 = data.image;

        // Decode base64 string to binary
        const binaryData = atob(imageBase64);

        // Convert binary data to Blob
        const blob = new Blob([new Uint8Array(binaryData.length).map((_, i) => binaryData.charCodeAt(i))], { type: 'image/jpeg' });

        // Create object URL from Blob
        const imageUrl = URL.createObjectURL(blob);

        // Add the image URL to the data
        data.image = imageUrl;
      }

      // Append the modified data to the chat history
      setChatHistory((prevChatHistory) => [...prevChatHistory, data]);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Close the WebSocket connection when the component unmounts
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [senderId, receiverId]);



  // useEffect(() => {

  //   var ws = new WebSocket(`ws://${ip_websocket}/ws/chat/30/31/`);
  //   setWs(ws)
  //   ws.onopen = function () {
  //     console.log('WebSocket connection established');
  //     ws.send(
  //       JSON.stringify(
  //         {
  //           "command": "Say hello !",
  //           "data_string": "This is the data string !",
  //         }
  //       )
  //     );
  //   };

  //   ws.onerror = function (error) {
  //     console.error('WebSocket error:', error);
  //   };

  //   ws.onmessage = function (event) {
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'message') {
  //       console.log(data.message)
  //     }
  //   };

  //   return () => {
  //     // Cleanup: Close the WebSocket connection when the component is unmounted
  //     ws.close();
  //   };
  // }, []);

  const [image, setImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const sendMessage = () => {
    console.log(ws);
    if (ws && (message.trim() !== '' || image !== null && image !== '')) {
      const data = {
        message: message,
        sender: user_id,
        receiver: reveiverr,
      };

      if (image !== null && image !== '') {
        const reader = new FileReader();
        reader.onloadend = function () {
          const base64Data = reader.result.split(',')[1];
          data.image = base64Data;  // Append the image data to the data object
          ws.send(JSON.stringify(data));
          console.log(base64Data);
        };

        reader.readAsDataURL(image);
      } else {
        ws.send(JSON.stringify(data));  // Send the data without image if image is not present
      }

      setMessage('');
    }
  };


  return (
    <div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div>
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <strong>{chat.sender.username}:</strong> {chat.message}
            {chat.image && <img src={chat.image} alt="image" id='imageElement' />}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="file" id='image' onChange={handleImageUpload} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
