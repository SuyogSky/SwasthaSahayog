import React, { useEffect, useState } from 'react'
import './SideBar.scss'
import { Link } from 'react-router-dom'
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { TbFileInvoice } from "react-icons/tb";
import { TiMessages } from "react-icons/ti";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";
import { MdOutlineFeedback } from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
function SideBar({ pharmacistData }) {
  const location = useLocation()
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const [completionPercentage, setCompletionPercentage] = useState(50)
  const calculateCompletionPercentage = () => {
    const totalFields = 9; // Total number of fields in the profile
    const nullFields = Object.values(pharmacistData).filter(value => value === null || value === undefined || value.length === 0).length;
    const completionPercentage = ((totalFields - nullFields) / totalFields) * 100;
    return Math.round(completionPercentage);
  };

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage())
  }, [pharmacistData])

  return (
    <div className="doctor-sidebar">
      <div className="top">
        <div className="container">
          <div className="contents">
            <div className="image" style={pharmacistData ? {
                        backgroundImage: `url(${pharmacistData.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      } : null}>

            </div>
            <h4>{pharmacistData.username}</h4>
            <p>{pharmacistData.speciality || 'Not Set'}</p>
          </div>
        </div>
      </div>

      <div className="profile-completion">
        <div className="number">
          <p>Complete your profile</p>
          <span>{completionPercentage}%</span>
        </div>

        <div className="progression-bar">
          <div className="progress" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>

      <div className="navigation-menu">
        <ul>
          <li><Link to='/doctor' className={isActiveLink('/doctor') ? 'active' : ''}><MdOutlineDashboard />Dashboard</Link></li>
          <li><Link to='/doctor/appointments' className={isActiveLink('/doctor/appointments') ? 'active' : ''}><FaRegCalendarCheck />Appointments</Link></li>
          <li><Link to='/'><TbFileInvoice />Invoices</Link></li>
          <li><Link to='/doctor/chat'><IoChatbubbleEllipsesOutline />Chat</Link></li>
          <li><Link to='/'><TiMessages />Messages</Link></li>
          <li><Link to='/'><IoPersonOutline />Profile</Link></li>
          <li><Link to='/pharmacist/edit-profile' className={isActiveLink('/doctor/edit-profile') ? 'active' : ''}><MdOutlineManageAccounts />Profile Settings</Link></li>
          <li><Link to='/'><FaHeartbeat />Patients</Link></li>
          <li><Link to='/'><MdOutlineFeedback />Patient Reviews</Link></li>
          <li><Link to='/'><BiLogOutCircle />Logout</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default SideBar