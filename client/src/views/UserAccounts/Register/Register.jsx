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
import { RxCross2 } from "react-icons/rx";
import Doctor from "../../../assets/Images/doctor.png"
import pharmacy from "../../../assets/Images/pharmacy.png"
import { IoShieldCheckmark } from "react-icons/io5";
import ip from '../../../ip';
import axios from 'axios'

const swal = require('sweetalert2')
function Register() {
    const navigate = useHistory();
    const [email, setEmail] = useState("")
    const [username, setUserName] = useState("")
    const [phone, setPhone] = useState("")
    const [city, setCity] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const { registerUser } = useContext(AuthContext)
    const history = useHistory()

    // ========== OPT ==========
    // display otp form
    const [displayOTP, setDisplayOTP] = useState(false)

    // const [otp, setOtp] = useState(['', '', '', '', '', '']);

    // // Handle OTP input change
    // const handleOtpChange = (index, value) => {
    //     const newOtp = [...otp];
    //     newOtp[index] = value;
    //     setOtp(newOtp);
    // };

    // // Handle OTP input key press
    // const handleKeyPress = (e, index) => {
    //     // Allow only numeric inputs
    //     const pattern = /^[0-9\b]+$/;
    //     if (!pattern.test(e.target.value)) {
    //         return;
    //     }

    //     // Focus on next input field on reaching maximum length
    //     if (e.target.value !== '' && index < 5) {
    //         document.getElementById(`otp_${index + 1}`).focus();
    //     }

    //     // Update state
    //     handleOtpChange(index, e.target.value);
    // };




    const [otp, setOtp] = useState(new Array(6).fill(""))
    const handleOTPChange = (e, index) => {
        if (isNaN(e.target.value)) return false

        setOtp([
            ...otp.map((data, indx) => indx === index ? e.target.value : data)
        ])

        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus()
        }
        else if (!e.target.value && e.target.previousSibling) {
            e.target.previousSibling.focus()
        }

    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain');
        if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
            const newOtp = pasteData.split('');
            setOtp(newOtp);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const address = city
        if (phone.length !== 10) {
            swal.fire({
                title: "Please enter a valid phone number.",
                icon: "warning",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }
        else if (password === password2) {
            try {
                const response = await fetch(`${ip}/api/register/client`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        phone,
                        address,
                        password,
                        password2,
                    }),
                });

                if (response.status === 200) {
                    // history.push("/login");
                    setDisplayOTP(true)
                    swal.fire({
                        title: "An OTP is sent to you mail.",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: "top-right",
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                        customClass: {
                            container: 'custom-swal-container',
                        }
                    });
                } else {
                    const errorData = await response.json(); // Parse error response
                    console.log(response.status);
                    console.log("Server error:", errorData);
                    if (errorData.email) {
                        swal.fire({
                            title: "User with this email already exixts.",
                            icon: "error",
                            toast: true,
                            timer: 6000,
                            position: "top-right",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                            customClass: {
                                container: 'custom-swal-container',
                            }
                        });
                    }
                    else if (errorData.password) {
                        swal.fire({
                            title: "Please choose stronger password.",
                            icon: "warning",
                            toast: true,
                            timer: 6000,
                            position: "top-right",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                            customClass: {
                                container: 'custom-swal-container',
                            }
                        });
                    }
                    else {
                        swal.fire({
                            title: "Registration Failed",
                            text: errorData.detail,
                            icon: "error",
                            toast: true,
                            timer: 6000,
                            position: "top-right",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                            customClass: {
                                container: 'custom-swal-container',
                            }
                        });
                    }
                }
            } catch (error) {
                console.error("Error during registration:", error);
                swal.fire({
                    title: "An unexpected error occurred",
                    icon: "error",
                    toast: true,
                    timer: 6000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        container: 'custom-swal-container',
                    }
                });
            }
        }
        else {
            swal.fire({
                title: "Password fields didn't matched.",
                icon: "warning",
                toast: true,
                timer: 6000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
                customClass: {
                    container: 'custom-swal-container',
                }
            });
        }
    }


    const verifyOTP = async () => {
        const otpData = new FormData();
        otpData.append('email', email);
        otpData.append('otp', otp.join(""));

        try {
            const response = await axios.post(`${ip}/api/verify-otp/`, otpData);

            if (response.data.status === 200) {
                const responseData = response.data;
                console.log('OTP verified:', responseData);
                swal.fire({
                    title: "Your OTP is Verified",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        container: 'custom-swal-container',
                    }
                });
                history.push('/login')
            } else {
                console.error('Error:', response.statusText);
                swal.fire({
                    // title: "Please add some content description.",
                    title: response.data.error,
                    icon: "warning",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                    customClass: {
                        container: 'custom-swal-container',
                    }
                });
            }
        } catch (error) {
            console.error('Error :', error);
        }
    }
    return (
        <section className="register-section">
            <div className="container">
                <form action="" onSubmit={handleSubmit}>
                    <h1>Sign<span>Up</span></h1>
                    <p>Create an account.</p>

                    <div className="full-name">
                        <input type="text" required placeholder='Full Name' onChange={e => setUserName(e.target.value)} />
                        <IoMdPerson />
                    </div>

                    <div className="email">
                        <input type="email" required placeholder='Email Address' onChange={e => setEmail(e.target.value)} />
                        <MdEmail />
                    </div>

                    <div className="phone">
                        <input type="number" minLength="10" maxLength="10" required placeholder='Phone Number' onChange={e => setPhone(e.target.value)} />
                        <FaPhone />
                    </div>

                    <div className="city">
                        <input type="text" required placeholder='Address' onChange={e => setCity(e.target.value)} />
                        <FaLocationCrosshairs />
                    </div>

                    <div className="password">
                        <input type="password" required placeholder='Password' onChange={e => setPassword(e.target.value)} />
                        <PiPasswordBold />
                    </div>

                    <div className="confirm-password">
                        <input type="password" required placeholder='Confirm Password' onChange={e => setPassword2(e.target.value)} />
                        <PiPasswordDuotone />
                    </div>

                    <button type="submit">Sign up</button>
                    {/* <button type="button" onClick={() => setDisplayOTP(true)}>Sign up</button> */}

                    <p className="already">Already Have an Account? <Link to="/login">Login</Link></p>


                    {displayOTP &&
                        <div className="otp-field-container">
                            <div className="otp-form">
                                <span className="icon">
                                    <IoShieldCheckmark />
                                </span>
                                <h4>Enter OTP Code</h4>
                                <div className='otp-fields'>
                                    {
                                        otp.map((data, i) => {
                                            return <input type="text"
                                                value={data}
                                                maxLength={1}
                                                onChange={(e) => handleOTPChange(e, i)}
                                                onPaste={(e) => handlePaste(e)}
                                            />
                                        })
                                    }
                                </div>
                                <button type="button" onClick={() => verifyOTP()}>Verify</button>
                                <button type="button" className='cancle' onClick={() => setDisplayOTP(false)}>Cancle</button>
                            </div>
                        </div>
                    }
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