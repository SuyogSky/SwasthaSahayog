import React, { useContext, useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode"
import AuthContext from '../../context/AuthContext'
import { Link } from "react-router-dom"
import { FaAngleDown } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import "./Navbar.scss"

import { FaPhone } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import EmptyProfile from '../../assets/Images/empty-profile.jpeg'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import ip from '../../ip';
import useAxios from '../../utils/useAxios';

function NavBar() {
    const location = useLocation();
    const history = useHistory()
    const axios = useAxios()
    const isActiveLink = (path) => {
        return location.pathname === path;
    };
    const areAnyActiveLinks = (paths) => {
        return paths.some((path) => isActiveLink(path));
    };
    const isParentPath = (path) => {
        return location.pathname.includes(path);
    }

    const { user, logoutUser } = useContext(AuthContext)
    const token = localStorage.getItem("authTokens")

    if (token) {
        const decoded = jwtDecode(token)
        var user_id = decoded.user_id
        console.log('decoded: ', decoded)
    }


    const [loggedInUser, setLoggedInUser] = useState()
    const fetchUserData = () => {
        axios.get(`${ip}/api/user/${user.user_id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                setLoggedInUser(response.data);
                sessionStorage.setItem('loggedInUser', JSON.stringify(response.data));
                localStorage.setItem('loggedInUser', JSON.stringify(response.data));
            })
            .catch(error => console.error('Error fetching client details:', error));
    };

    useEffect(() => {
        if (sessionStorage.getItem('currentUser')) {
            fetchUserData();
        }
    }, [user]);


    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                setIsScrolled(true);
            }
            else if (scrollY == 0) {
                setIsScrolled(false)
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`nav-header ${isScrolled ? 'scrolled' : ''}`}>
            {/* <div className="info">
                <div className="contact">
                    <p className='phone'><FaPhone /> +977-9876543210</p>
                    <p className="email"><IoMail /> support@gmail.com</p>
                </div>
                <div className="location">
                    <p className="address"><FaLocationDot /> Dharan, Sunsari.</p>
                </div>
            </div> */}
            <nav className="nav-bar">
                <div className="logo">
                    Swastha Sahayog
                </div>

                <ul className="nav-menu">
                    <li><Link to="/" className={isActiveLink('/') ? 'active' : ''}>Home</Link></li>

                    <li>
                        <Link to={location.pathname} className={areAnyActiveLinks(['/register-doctor', '/doctors', '/book-appointment']) ? 'active' : ''}>Services <FaAngleDown className='down-arrow' /></Link>
                        <ul className="submenu services-sub-menu">
                            {
                                user ?
                                    <>
                                        <li>
                                            <Link to='/doctors' className={isActiveLink('/doctors') ? 'active' : ''} Required>View Doctors</Link>
                                        </li>
                                        <li>
                                            <Link to="/nearby-clinics">Nearby Clinics</Link>
                                        </li>
                                        <li>
                                            <Link to="/nearby-pharmacies">Nearby Pharmacies</Link>
                                        </li>
                                    </>
                                    :
                                    <>
                                        <li>
                                            <Link to='/register-doctor' className={isActiveLink('/register-doctor') ? 'active' : ''} Required>Become a Doctor</Link>
                                        </li>
                                        <li>
                                            <Link to='/register-pharmacy' className={isActiveLink('/register-pharmacy') ? 'active' : ''} Required>Register Pharmacy</Link>
                                        </li>
                                    </>
                            }
                        </ul>
                    </li>

                    {loggedInUser && loggedInUser.role === "client" && (
                        <li>
                            <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''}>Pages <FaAngleDown className='down-arrow' /></Link>
                            <ul className="submenu doctors-sub-menu">
                                {/* Add sub-menu items here */}
                                <li>
                                    <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''} id={!token && 'disabled'} title={!token && `Login Required`} Required>Dashboard <FaChevronRight /></Link>
                                    {token && loggedInUser && loggedInUser.role === 'client' && (
                                        <ul className="submenu dashboard-sub-menu">
                                            {/* Add sub-menu items here */}
                                            <li><Link to="/client/appointments" className={isActiveLink('/client/') ? 'active' : ''}>Dashboard</Link></li>
                                            <li><Link to='/client/appointments' className={isActiveLink('/client/appointments') ? 'active' : ''}>Appointments</Link></li>
                                            <li><Link to={`/profile/${loggedInUser.id}`} className={isActiveLink(`/profile/${loggedInUser.id}`) ? 'active' : ''}>Profile</Link></li>
                                            <li><Link to="/client/edit-profile" className={isActiveLink('/client/edit-profile') ? 'active' : ''}>Profile Settings</Link></li>
                                        </ul>
                                    )}
                                </li>
                                <li><Link to='/client/chat' className={isActiveLink('/client/chat') ? 'active' : ''}>Chat</Link></li>
                                <li><Link to="/doctors">View Doctors</Link></li>
                            </ul>
                        </li>
                    )}

                    {loggedInUser && loggedInUser.role === "doctor" && (
                        <li>
                            <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''}>Pages <FaAngleDown className='down-arrow' /></Link>
                            <ul className="submenu doctors-sub-menu">
                                {/* Add sub-menu items here */}
                                <li>
                                    <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''} id={!token && 'disabled'} title={!token && `Login Required`} Required>Dashboard <FaChevronRight /></Link>
                                    {token && loggedInUser && loggedInUser.role === 'doctor' && (
                                        <ul className="submenu dashboard-sub-menu">
                                            {/* Add sub-menu items here */}
                                            <li><Link to="/doctor/appointments" className={isActiveLink('/doctor/') ? 'active' : ''}>Dashboard</Link></li>
                                            <li><Link to='/doctor/appointments' className={isActiveLink('/doctor/appointments') ? 'active' : ''}>Appointments</Link></li>
                                            <li><Link to='/doctor/chat' className={isActiveLink('/doctor/chat') ? 'active' : ''}>Chat</Link></li>
                                            <li><Link to={`/profile/${loggedInUser.id}`} className={isActiveLink(`/profile/${loggedInUser.id}`) ? 'active' : ''}>Profile</Link></li>
                                            <li><Link to="/doctor/edit-profile" className={isActiveLink('/doctor/edit-profile') ? 'active' : ''}>Profile Settings</Link></li>
                                        </ul>
                                    )}
                                </li>
                                <li><Link to="/doctors">View Doctors</Link></li>
                            </ul>
                        </li>
                    )}





                    {loggedInUser && loggedInUser.role === "pharmacist" && (
                        <li>
                            <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''}>Pages <FaAngleDown className='down-arrow' /></Link>
                            <ul className="submenu pharmacist-sub-menu">
                                {/* Add sub-menu items here */}
                                <li>
                                    <Link to={location.pathname} className={isParentPath('/profile-settings/') ? 'active' : ''} id={!token && 'disabled'} title={!token && `Login Required`} Required>Dashboard <FaChevronRight /></Link>
                                    {token && loggedInUser && loggedInUser.role === 'pharmacist' && (
                                        <ul className="submenu dashboard-sub-menu">
                                            {/* Add sub-menu items here */}
                                            <li><Link to="/pharmacist/orders" className={isActiveLink('/pharmacist/') ? 'active' : ''}>Dashboard</Link></li>
                                            <li><Link to='/pharmacist/orders' className={isActiveLink('/pharmacist/orders') ? 'active' : ''}>Orders</Link></li>
                                            <li><Link to='/pharmacist/chat' className={isActiveLink('/pharmacist/chat') ? 'active' : ''}>Chat</Link></li>
                                            <li><Link to={`/profile/${loggedInUser.id}`} className={isActiveLink(`/profile/${loggedInUser.id}`) ? 'active' : ''}>Profile</Link></li>
                                            <li><Link to="/pharmacist/edit-profile" className={isActiveLink('/pharmacist/edit-profile') ? 'active' : ''}>Profile Settings</Link></li>
                                        </ul>
                                    )}
                                </li>
                                <li><Link to="/doctors">View Doctors</Link></li>
                            </ul>
                        </li>
                    )}

                    <li><Link to="/posts">Posts</Link></li>
                    <li><Link to="/nearby-clinics">View Map</Link></li>
                    <li><Link to="/client/chat">Inbox</Link></li>
                </ul>

                <div className="interactions">
                    {token === null &&
                        <>
                            <Link class="nav-link" to="/login" className="login-btn">Login</Link>
                            <Link class="nav-link" to="/register" className="register-btn">Register</Link>
                        </>
                    }

                    {token !== null &&
                        <>
                            <FiHeart />

                            {/* <Link to={`/profile/${user_id}`}><span className="user-icon" style={loggedInUser ? { */}
                            <div className='user-icon'><span className="user-icon" style={loggedInUser ? {
                                // backgroundImage: `url(${loggedInUser.image || '../../assets/Images/empty-profile.jpeg'})`,
                                backgroundImage: `url(${loggedInUser.image || EmptyProfile})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            } : null}>
                                <ul className="submenu">
                                    <li onClick={() => history.push(`${loggedInUser.role}`)}><MdOutlineDashboard />Dashboard</li>
                                    <li><IoSettingsOutline />Profile Settings</li>
                                    <li className="logout" onClick={logoutUser}><BiLogOutCircle />Logout</li>
                                </ul>

                            </span></div>

                        </>
                    }
                </div>
            </nav>
        </header>
    )
}

export default NavBar