import React, { useState, useEffect, useRef } from 'react'
// import './Chat.scss'
import { IoSearch } from "react-icons/io5";
import useAxios from '../../../utils/useAxios'
import { jwtDecode } from 'jwt-decode';
import ip from '../../../ip';
import moment from 'moment'
import { useParams, Link } from 'react-router-dom';

function Inbox() {
    const baseUrl = `${ip}/chat`
    const [messages, setMessages] = useState([])

    const { id } = useParams()
    const axios = useAxios()

    const token = localStorage.getItem("authTokens")
    const decoded = jwtDecode(token)
    const user_id = decoded.user_id

    useEffect(() => {
        try {
            axios.get(baseUrl + '/my-messages/' + user_id + '/').then((res) => {
                console.log(res)
                setMessages(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [])



    // ========== For Message Details ==========
    const [message, setMessage] = useState()
    useEffect(() => {
        try {
            axios.get(baseUrl + '/get-messages/' + user_id + '/' + id + '/').then((res) => {
                setMessage(res.data)
                console.log('mess: ', res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }, [id])

    // useEffect(() => {
    //     let interval = setInterval(() => {
    //         try {
    //             axios.get(baseUrl + '/get-messages/' + user_id + '/' + id + '/').then((res) => {
    //                 setMessage(res.data)
    //                 console.log('mess: ', res.data)
    //             })
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }, 2000)
    //     return () => {
    //         clearInterval(interval)
    //     }
    // }, [id])

    const inboxRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when messages change or component mounts
    if (inboxRef.current) {
      inboxRef.current.scrollTop = inboxRef.current.scrollHeight;
    }
  }, [message]);

    return (
        <div className="chat-main-container">
            <div className="users-list-container">
                <h4>Chats</h4>
                <div className="search-bar">
                    <IoSearch />
                    <input type="text" placeholder='Search Chat' />
                </div>
                <div className="users">

                    {
                        messages.map((message) => {
                            const id = message.sender.id===user_id?message.reciever.id:message.sender.id
                            return (
                                <Link className="user" to={'/doctor/inbox/' + id}>
                                    {message.sender.id === user_id &&
                                        <div className="image" style={message ? {
                                            backgroundImage: `url(${message.reciever.image})`,
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
                                    <div className="user-details">
                                        {message.sender.id !== user_id &&
                                            <h6>{message.sender.username}</h6>
                                        }
                                        {message.sender.id === user_id &&
                                            <h6>{message.reciever.username}</h6>
                                        }

                                        <p><span className='message'>{message.message}</span> <span className='time'>{moment.utc(message.date).local().startOf('seconds').fromNow()}</span></p>
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
                        <div className="image">

                        </div>
                        <div className="details">
                            <h6>username</h6>
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

                    {message && message.map(message => {
                        return (
                            <>
                                {message.sender.id === user_id &&
                                    <div className="message sent">
                                        <div className="profile">
                                            <div className="image" style={message ? {
                                            backgroundImage: `url(${message.sender.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>

                                            </div>
                                            <span>2:22 pm</span>
                                        </div>
                                        <div className="message-content">
                                            <p>You</p>
                                            <span>{message.message}</span>
                                        </div>
                                    </div>
                                }
                                {message.sender.id !== user_id &&
                                    <div className="message recieved">
                                        <div className="profile">
                                            <div className="image" style={message ? {
                                            backgroundImage: `url(${message.sender.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>

                                            </div>
                                            <span>2:22 pm</span>
                                        </div>
                                        <div className="message-content">
                                            <p>{message.sender.username}</p>
                                            <span>{message.message}</span>
                                        </div>
                                    </div>
                                }
                            </>
                        )
                    })}
                </div>

                <div className="message-input-field">

                </div>
            </div>
        </div>
    )
}

export default Inbox