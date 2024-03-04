import React, { useState, useContext } from 'react'
import { useHistory, Link } from "react-router-dom"
import AuthContext from '../../../context/AuthContext'

import "./Register.scss"

import { IoMdPerson } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { PiPasswordBold } from "react-icons/pi";
import { PiPasswordDuotone } from "react-icons/pi";
import { FaPhone } from "react-icons/fa6";
import { FaLocationCrosshairs } from "react-icons/fa6";

import Doctor from "../../../assets/Images/doctor.png"
import pharmacy from "../../../assets/Images/pharmacy.png"


function Register() {
    const navigate = useHistory();

    const [email, setEmail] = useState("")
    const [username, setUserName] = useState("")
    const [phone, setPhone] = useState("")
    const [city, setCity] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const { registerUser } = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault()
        registerUser(email, username, phone, city, password, password2)
    }

    return (
        <section className="register-section">
            <div className="container">
                <form action="" onSubmit={handleSubmit}>
                    <h1>Sign<span>Up</span></h1>
                    <p>Create an account.</p>

                    <div className="full-name">
                        <input type="text" placeholder='Full Name' onChange={e => setUserName(e.target.value)} />
                        <IoMdPerson />
                    </div>

                    <div className="email">
                        <input type="email" placeholder='Email Address' onChange={e => setEmail(e.target.value)} />
                        <MdEmail />
                    </div>

                    <div className="phone">
                        <input type="number" placeholder='Phone Number' onChange={e => setPhone(e.target.value)} />
                        <FaPhone />
                    </div>

                    <div className="city">
                        <input type="text" placeholder='Address' onChange={e => setCity(e.target.value)} />
                        <FaLocationCrosshairs />
                    </div>

                    <div className="password">
                        <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} />
                        <PiPasswordBold />
                    </div>

                    <div className="confirm-password">
                        <input type="password" placeholder='Confirm Password' onChange={e => setPassword2(e.target.value)} />
                        <PiPasswordDuotone />
                    </div>

                    <button type="submit">Sign up</button>

                    <p className="already">Already Have an Account? <Link to="/login">Login</Link></p>
                </form>

                <div className="register-options">
                    <div className="doctor" onClick={() => navigate.push('/register-doctor')}>
                        <img src={Doctor} alt="" />
                        <p>Become our <span>Doctor</span>.</p>
                    </div>

                    <div className="pharmacist">
                        <img src={pharmacy} alt="" />
                        <p>Register as <span>Pharmacist</span>.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register