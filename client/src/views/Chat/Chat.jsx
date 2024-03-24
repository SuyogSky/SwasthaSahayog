import React, { useState, useEffect } from 'react'
import './Chat.scss'
import { IoSearch } from "react-icons/io5";
import useAxios from '../../utils/useAxios'
import { jwtDecode } from 'jwt-decode';
import ip from '../../ip';
import moment from 'moment'
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
function Chat() {
    const history = useHistory()
    const baseUrl = `${ip}/chat`

    const [messages, setMessages] = useState([])

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
    // useEffect(() => {
    //     try{
    //         axios.get(baseUrl + '/get-messages/' + user_id)
    //     } catch (error){
    //         console.log(error)
    //     }
    // })
    const [newSearch, setNewSearch] = useState('')

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
                            history.push('/doctor/search/' + newSearch)
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
                            const id = message.sender.id === user_id ? message.receiver.id : message.sender.id
                            return (
                                <Link className="user" to={'/' + decoded.role + '/inbox/' + id}>
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

            </div>
        </div>
    )
}

export default Chat