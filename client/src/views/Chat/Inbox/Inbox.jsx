import React, { useState, useEffect, useRef } from 'react'
// import './Chat.scss'
import { IoSearch } from "react-icons/io5";
import useAxios from '../../../utils/useAxios'
import { jwtDecode } from 'jwt-decode';
import ip from '../../../ip';
import ip_websocket from '../../../ip_websocket';
import moment from 'moment'
import { useParams, Link } from 'react-router-dom';
import { IoImageOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { MdOutlineArrowRight } from "react-icons/md";
function Inbox() {
    const history = useHistory()
    const token = localStorage.getItem("authTokens")
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id


    const baseUrl = `${ip}/chat`
    const [messages, setMessages] = useState([])

    const { id } = useParams()
    const axios = useAxios()



    const [visitedUserData, setVisitedUserData] = useState(null);

    // Fetch client details from the backend API using the client ID
    const fetchUserData = () => {
        axios.get(`${ip}/api/user/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                setVisitedUserData(response.data);
                console.log('visited user is', response.data.role);
            })
            .catch(error => console.error('Error fetching client details:', error));
    };
    useEffect(() => {
        fetchUserData();
    }, [id]);

    // ========== For Message Details ==========
    const [message, setMessage] = useState()
    const [chatHistory, setChatHistory] = useState([]);
    const [newSearch, setNewSearch] = useState('')
    const getChats = () => {
        try {
            axios.get(baseUrl + '/my-messages/' + user_id + '/').then((res) => {
                console.log(res)
                setMessages(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getChats()
    }, [chatHistory, history])

    const markMessagesAsRead = async (senderId, receiverId) => {
        console.log(senderId, user_id)
        if (senderId == user_id) {
            try {
                await axios.post(`${baseUrl}/mark_messages_as_read/${senderId}/${receiverId}/`);
                console.log('Messages marked as read successfully.');
                getChats()
            } catch (error) {
                console.error('Error marking messages as read:', error);
            }
        }
    };

    const [isFocused, setIsFocused] = useState(false)
    useEffect(() => {
        if (isFocused) {
            // markMessagesAsRead(user_id, id)
        }
    }, [id, chatHistory, isFocused])
    const getChatHistory = () => {
        try {
            axios.get(baseUrl + '/get-messages/' + user_id + '/' + id + '/').then((res) => {
                setChatHistory(res.data)
                console.log('mess: ', res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getChatHistory()
        // }, [id, history])
    }, [id, history])


    const [ws, setWs] = useState(null);
    useEffect(() => {
        // Open a WebSocket connection when the component mounts
        const socket = new WebSocket(`ws://${ip_websocket}/ws/chat/${user_id}/${id}/`);

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
    }, [user_id, id]);


    const [receiverData, setReceiverData] = useState(null);

    useEffect(() => {
        // Filter messages based on the id from the URL params
        const filteredMessages = messages.filter((message) => {
            const receiverId = message.sender.id === user_id ? message.receiver.id : message.sender.id;
            return receiverId === parseInt(id, 10);
        });

        // Use the first message from the filtered messages to set receiver data
        if (filteredMessages.length > 0) {
            const receiver = filteredMessages[0].sender.id === user_id ? filteredMessages[0].receiver : filteredMessages[0].sender;
            setReceiverData(receiver);
        } else {
            setReceiverData(null); // Reset receiverData if no matching messages
        }
    }, [id, messages, user_id]);

    // useEffect(() => {
    //     let interval = setInterval(() => {
    //         getChatHistory()
    //     }, 2000)
    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [id])




    // ========== Web Socket ==========

    // const [ws, setWs] = useState(null);
    // useEffect(() => {
    //     var ws = new WebSocket(`ws://${ip_websocket}/ws/chat/${user_id}/${id}/`);
    //     setWs(ws)
    //     ws.onopen = function () {
    //         console.log('WebSocket connection established');
    //     };

    //     ws.onerror = function (error) {
    //         console.error('WebSocket error:', error);
    //     };

    //     ws.onmessage = function (event) {
    //         const data = event.data;
    //         console.log("THe received message: ", JSON.parse(data))
    //         if (data.type === 'message') {
    //         }
    //     };

    //     return () => {
    //         // Cleanup: Close the WebSocket connection when the component is unmounted
    //         ws.close();
    //     };
    // }, []);


    const [text, setText] = useState('')

    // const sendMessage = (e) => {
    //     e.preventDefault()
    //     const formData = new FormData()
    //     formData.append("user", user_id)
    //     formData.append("sender", user_id)
    //     formData.append("receiver", id)
    //     if (image !== null && image != '') {
    //         formData.append("image", image)
    //     }
    //     formData.append("message", text)
    //     formData.append("is_read", false)

    //     try {
    //         axios.post(baseUrl + '/send-messages/', formData).then((res) => {
    //             console.log(res.data)
    //             setText('')
    //             setImage(null)
    //             setDisplayImage(null)
    //             getChatHistory()
    //         })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    const sendMessage = (e) => {
        e.preventDefault()
        console.log(ws);
        if (ws && (text.trim() !== '' || image !== null && image !== '')) {
            const data = {
                message: text,
                sender: user_id,
                receiver: id,
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

            setText('');
            setImage(null)
            setDisplayImage(null)

        }
    };

    // const sendMessage = () => {
    //     var ws = new WebSocket(`ws://${ip_websocket}/ws/chat/${user_id}/${id}/`);
    //     setWs(ws)
    //     ws.onopen = function () {
    //         console.log('WebSocket connection established');
    //         const data = {
    //             message: text,
    //             sender: user_id,
    //             receiver: id,
    //         };
    //         ws.send(JSON.stringify(data));
    //     };

    //     ws.onerror = function (error) {
    //         console.error('WebSocket error:', error);
    //     };

    //     ws.onmessage = function (event) {
    //         const data = JSON.parse(event.data);
    //         console.log("i got: ", data)
    //         var text = {
    //             message: data.message,
    //             sender: data.sender,
    //             receiver: data.receiver,
    //             timestamp: 'event',  // You may want to update this with the actual timestamp
    //         };

    //         // Use the setChatHistory function to append the new message to the existing chat history
    //         setChatHistory(prevHistory => [...prevHistory, text]);
    //         // setChatHistory(JSON.parse(data.chat_history))
    //         // getChatHistory()
    //         if (data.type === 'message') {
    //         }
    //     };

    //     return () => {
    //         // Cleanup: Close the WebSocket connection when the component is unmounted
    //         ws.close();
    //     };
    // };

    const inboxRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom when messages change or component mounts
        if (inboxRef.current) {
            inboxRef.current.scrollTop = inboxRef.current.scrollHeight;
        }
    }, [message, chatHistory, history]);


    const [displayImage, setDisplayImage] = useState(null);
    const [image, setImage] = useState(null)
    const [viewFullImage, setViewFullImage] = useState(false)

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
        console.log('file is uploaded')
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setDisplayImage(event.target.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const cancleClicked = () => {
        setDisplayImage(null)
        setImage(null)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (newSearch.length > 0) {
            try {
                axios.get(baseUrl + '/search/' + newSearch + '/')
                    .then((res) => {
                        if (res.status === 404) {
                            console.log(res.details)
                            alert('User does not exist.')
                        }
                        else {
                            history.push('/' + decoded.role + '/search/' + newSearch)
                        }
                    })
                    .catch((error) => {
                        console.log('No user found')
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const [receiverUser, setReceiverUser] = useState()

    return (
        <div className="chat-main-container">
            <div className="users-list-container">
                <h4>Chats</h4>
                <form className="search-bar" onSubmit={handleSearch}>
                    <button type="submit"><IoSearch /></button>
                    <input type="text" placeholder='Search Chat' onChange={(e) => setNewSearch(e.target.value)} />
                </form>
                <div className="users">

                    {
                        messages.map((message) => {
                            const reveiverId = message.sender.id === user_id ? message.receiver.id : message.sender.id
                            return (
                                <Link className={`user ${id == reveiverId ? 'active' : ''}`} to={'/' + decoded.role + '/inbox/' + reveiverId} onClick={() => markMessagesAsRead(user_id, reveiverId)}>
                                    {message.sender.id === user_id &&
                                        <div className="image" style={message ? {
                                            backgroundImage: `url(${message.receiver.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>
                                        </div>
                                    }

                                    {message.sender.id !== user_id &&
                                        <div className="image" style={message ? {
                                            backgroundImage: `url(${message.sender.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>
                                        </div>
                                    }
                                    <div className={`user-details ${(message.sender.id !== user_id && !message.is_read) && 'unread'}`}>
                                        {message.sender.id !== user_id &&
                                            <h6>{message.sender.username}</h6>
                                        }
                                        {message.sender.id === user_id &&
                                            <h6>{message.receiver.username}</h6>
                                        }

                                        <p className='message-display'><span className='message'>{message.sender.id === user_id && 'You: '}{message.message ? message.message : message.image ? 'Sent Attachment.' : null}</span> <span className='time'>{moment.utc(message.date).local().startOf('seconds').fromNow()}</span></p>
                                    </div>
                                </Link>
                            )
                        })
                    }

                </div>
            </div>

            <div className="message-box-container">
                <div className="top">
                    <div className="user-detail">
                        <div className="image" style={visitedUserData ? {
                            backgroundImage: `url(${visitedUserData.image})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        } : null}>

                        </div>
                        <div className="details">
                            <h6>{visitedUserData?.username}</h6>
                            <p>online</p>
                        </div>
                    </div>
                    <span>...</span>
                </div>

                <div className="inbox" ref={inboxRef}>
                    {/* {message.map((message, index) => {
                        // message.sender === user_id &&
                        //     <div className="message sent">
                        //         <div className="image">

                        //         </div>
                        //         sdasdfasdf
                        //     </div>

                        // message.sender !== user_id &&
                        //     <div className="message recieved">
                        //         <div className="image">

                        //         </div>
                        //         sdasdfasdf
                        //     </div>
                    }
                    )} */}
                    <div className="first">
                        <div className="image" style={visitedUserData ? {
                            backgroundImage: `url(${visitedUserData.image})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        } : null}>

                        </div>
                        <h6>{visitedUserData?.username}</h6>
                        <p>You can chat with eachother.</p>
                        <span onClick={() => history.push('/profile/' + visitedUserData.id)}>View Profile</span>
                    </div>

                    {chatHistory && chatHistory.map(message => {
                        return (
                            <>
                                {message.sender.id === user_id &&
                                    <div className="message sent">
                                        <div className="profile">
                                            <div className="image" style={message ? {
                                                backgroundImage: `url(${(message.sender.image).includes(ip) ? message.sender.image : ip + message.sender.image})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                            } : null}>

                                            </div>
                                            <span>2:22 pm</span>
                                        </div>
                                        <div className="message-container">
                                            {message.message && (
                                                <div className="message-content">
                                                    <MdOutlineArrowRight />
                                                    <p>You</p>
                                                    <span>{message.message}</span>
                                                </div>
                                            )}
                                            {message.image && <img src={message.image} alt="image" />}
                                        </div>
                                    </div>
                                }
                                {message.sender.id !== user_id &&
                                    <div className="message recieved">
                                        <div className="profile">
                                            <div className="image" style={message ? {
                                                backgroundImage: `url(${(message.sender.image).includes(ip) ? message.sender.image : ip + message.sender.image})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                            } : null}>

                                            </div>
                                            <span>2:22 pm</span>
                                        </div>
                                        <div className="message-container">
                                            {message.message && (
                                                <div className="message-content">
                                                    <MdOutlineArrowRight />
                                                    <p>{message.sender.username}</p>
                                                    <span>{message.message}</span>
                                                </div>
                                            )}
                                            {message.image && <img src={message.image} alt="image" />}
                                        </div>
                                    </div>
                                }
                            </>
                        )
                    })}
                </div>

                <form className="message-input-field" onSubmit={sendMessage}>
                    {displayImage !== null && (
                        <div className="image-display">
                            <div className="image" style={{
                                backgroundImage: `url(${displayImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}>

                            </div>
                            <div className="cancle" onClick={() => cancleClicked()}>
                                <RxCross2 />
                            </div>
                        </div>
                    )}
                    <input type="text" name="message" placeholder='Enter Message Here...' onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} value={text} onChange={(e) => setText(e.target.value)} />
                    <input type="file" id='image' onChange={handleImageUpload} />
                    <label htmlFor="image"><IoImageOutline /></label>
                    <button type="submit"><BsSend /></button>
                </form>
            </div>
        </div>
    )
}

export default Inbox