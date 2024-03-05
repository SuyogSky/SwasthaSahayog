import React, { useEffect, useState } from 'react'
import ip from '../../../ip'
import { Link, useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { IoSearch } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import useAxios from '../../../utils/useAxios';
import swal from 'sweetalert2'

function SearchUser() {
    const baseUrl = `${ip}/chat`
    const history = useHistory()
    const { username } = useParams()
    const axios = useAxios()

    const [newSearch, setNewSearch] = useState('')
    const [user, setUser] = useState([])

    useEffect(() => {
        axios.get(baseUrl + '/search/' + username + '/')
            .then((res) => {
                setUser(res.data)
                console.log(res.data)
            })
            .catch((error) => {
                swal.fire({
                    title: "User does not exist.",
                    icon: "error",
                    toast: true,
                    timer: 2000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                })
            })
    }, [history, username])

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
                            setUser(res.data)
                        }
                    })
                    .catch((error) => {
                        console.log('No user found')
                        swal.fire({
                            title: "User does not exist.",
                            icon: "error",
                            toast: true,
                            timer: 2000,
                            position: 'top-right',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                        })
                    })
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <div className="chat-main-container">
            <div className="users-list-container">
                <h4>Users</h4>
                <form className="search-bar" onSubmit={handleSearch}>
                    <button type="submit"><IoSearch /></button>
                    <input type="text" placeholder='Search Chat' onChange={(e) => setNewSearch(e.target.value)} />
                </form>
                <div className="users found-users">
                    {user ? user.map((user, index) => {
                        return (
                            <Link className="user" to={'/doctor/inbox/' + user.id}>
                                <div className="image" style={user ? {
                                    backgroundImage: `url(${user.image})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                } : null}>
                                </div>

                                <div className="user-details">

                                    <h6>{user.username}</h6>
                                    <p><MdOutlineMessage />Send Message.</p>
                                </div>
                            </Link>
                        )
                    })
                        : null}
                    {/* {
                        messages.map((message) => {
                            const id = message.sender.id === user_id ? message.receiver.id : message.sender.id
                            return (
                                <Link className="user" to={'/doctor/inbox/' + id}>
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
                                    <div className="user-details">
                                        {message.sender.id !== user_id &&
                                            <h6>{message.sender.username}</h6>
                                        }
                                        {message.sender.id === user_id &&
                                            <h6>{message.receiver.username}</h6>
                                        }

                                        <p><span className='message'>{message.message ? message.message : message.image ? 'Sent Attachment.' : null}</span> <span className='time'>{moment.utc(message.date).local().startOf('seconds').fromNow()}</span></p>
                                    </div>
                                </Link>
                            )
                        })
                    } */}

                </div>
            </div>

            <div className="message-box-container">

            </div>
        </div>
    )
}

export default SearchUser