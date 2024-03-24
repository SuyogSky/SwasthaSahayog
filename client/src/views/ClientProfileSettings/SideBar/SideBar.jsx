import React, { useEffect, useState } from 'react'
import './SideBar.scss'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { FaRegUserCircle } from "react-icons/fa";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { HiOutlinePhone } from "react-icons/hi";
import { TiHomeOutline } from "react-icons/ti";
import { MdOutlineBloodtype } from "react-icons/md";

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

function SideBar({ clientData }) {
  const location = useLocation()
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }

  const [completionPercentage, setCompletionPercentage] = useState(50)
  const calculateCompletionPercentage = () => {
    const totalFields = 9; // Total number of fields in the profile
    const nullFields = Object.values(clientData).filter(value => value === null || value === undefined || value.length === 0).length;
    const completionPercentage = ((totalFields - nullFields) / totalFields) * 100;
    return Math.round(completionPercentage);
  };

  useEffect(() => {
    setCompletionPercentage(calculateCompletionPercentage())
    console.log('Client Data is: ', clientData)
  }, [clientData])

  return (
    <div className="client-sidebar">
      <div className="top">
        <div className="container">
          <div className="contents">
            <div className="image" style={clientData ? {
              backgroundImage: `url(${clientData.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            } : null}>

            </div>
            <h4>{clientData.username}</h4>
            <p>{calculateAge(clientData.date_of_birth) + ' Years Old' || 'Not Set'}</p>
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

      <div className="profile-info">
        <ul>
          <li><MdOutlineBloodtype /> Blood Group <span>{clientData.blood_group || 'Not Set'}</span></li>
          <li><LiaBirthdayCakeSolid /> Birthday <span>{clientData.date_of_birth || 'Not Set'}</span></li>
          <li><HiOutlinePhone /> Phone <span>{clientData.phone || 'Not Set'}</span></li>
          <li><TiHomeOutline /> Address <span>{clientData.address || 'Not Set'}</span></li>
          <li><FaRegUserCircle /> Gender <span>{clientData.gender || 'Not Set'}</span></li>
        </ul>
      </div>

      <div className="navigation-menu">
        <ul>
          <li><Link to='/client/dashboard' className={isActiveLink('/client/dashboard') ? 'active' : ''}><MdOutlineDashboard />Dashboard</Link></li>
          <li><Link to='/client/appointments'><FaRegCalendarCheck />Appointments</Link></li>
          <li><Link to='/'><TbFileInvoice />Invoices</Link></li>
          <li><Link to='/'><TiMessages />Messages</Link></li>
          <li><Link to='/'><IoPersonOutline />Profile</Link></li>
          <li><Link to='/client/edit-profile' className={isActiveLink('/client/edit-profile') ? 'active' : ''}><MdOutlineManageAccounts />Profile Settings</Link></li>
          <li><Link to='/'><FaHeartbeat />Patients</Link></li>
          <li><Link to='/'><MdOutlineFeedback />Patient Reviews</Link></li>
          <li><Link to='/client/chat'><IoChatbubbleEllipsesOutline />Chat</Link></li>
          <li><Link to='/'><BiLogOutCircle />Logout</Link></li>
        </ul>
      </div>

    </div>
  )
}

export default SideBar