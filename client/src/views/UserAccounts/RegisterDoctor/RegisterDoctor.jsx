import React, { useState, useContext } from 'react'
import AuthContext from '../../../context/AuthContext'
import { FaAngleDoubleDown } from 'react-icons/fa'
import { TiTick } from "react-icons/ti";

import './RegisterDoctor.scss'
import ip from '../../../ip';

import { IoShieldCheckmark } from "react-icons/io5";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

const swal = require('sweetalert2')
function RegisterDoctor() {

  const history = useHistory()
  const [email, setEmail] = useState("")
  const [username, setUserName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [license, setLicense] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")

  const calculateCompletionPercentage = () => {
    const filledFields = [username, email, phone, city, license, password, password2].filter(Boolean).length;
    const totalFields = 7;
    const percentage = (filledFields / totalFields) * 100;
    return percentage;
  };

  const { registerDoctor } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email, username, phone, city, license, password, password2) {
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
        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('phone', phone);
        formData.append('address', city);
        formData.append('medical_license', license);
        formData.append('password', password);
        formData.append('password2', password2);

        try {
          const response = await fetch(`${ip}/api/register/doctor`, {
            method: "POST",
            body: formData,  // No need to set Content-Type
          });

          console.log('Doctor Registration response: ', response)

          if (response.status === 200) {
            // history.push("/login");
            setDisplayOTP(true)
            swal.fire({
              title: "An OTP is sent to your mail.",
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
            console.log("Server error:", errorData.error);
            if (errorData.error) {
              swal.fire({
                title: errorData.error,
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
            else if (errorData.error.password) {
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
                text: errorData.error.detail,
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
          });
        }
      }
      else {
        swal.fire({
          title: "Password fields didn't matched.",
          icon: "warning",
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
          showCloseButton: true,
        })
      }
    }
    else {
      swal.fire({
        title: "Please fill all the fields.",
        icon: "warning",
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }



  // for otp
  const [displayOTP, setDisplayOTP] = useState(false)
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


  const resendOTP = async () => {
    const otpData = new FormData();
    otpData.append('email', email);

    try {
      const response = await axios.patch(`${ip}/api/verify-otp/`, otpData);

      if (response.data.status === 200) {
        const responseData = response.data;
        console.log('OTP Resent:', responseData);
        swal.fire({
          title: "New OTP Sent in yout mail.",
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
        // history.push('/login')
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
    <section className="register-doctor-section">
      <div className="banner">
        <div className="text">
          <h2>Join Our Expert Medical Team</h2>
          <p>Calling all doctors! Your journey to making a positive impact on lives begins with us. Register today and be part of a community dedicated to healing and compassion.</p>
        </div>
        <FaAngleDoubleDown className="float" />
      </div>
      <div className="register-main-container">
        <div className="form-container">
          <div className="top">
            <h2>Become A Doctor</h2>
          </div>
          <div className="content">
            <div className="guidelines">
              <h4>Become a Doctor</h4>
              <p>Be a doctor on our platform to reach more people. Enable online bookings, share your clinic details, and make healthcare accessible. Join us in connecting patients with ease!</p>

              <h4>Doctor Rules</h4>
              <p>Maintain a high standard of professionalism in all interactions with patients and colleagues.</p>
              <ul>
                <li><TiTick />Comply to schedule appointments and respond promptly to patients.</li>
                <li><TiTick />Provide up-to-date information about your qualifications and services.</li>
                <li><TiTick />Respect patient confidentiality and ensure the security of their information.</li>
                <li><TiTick />Communicate clearly with parients, explaining diagnosis and treatments.</li>
                <li><TiTick />Specify your working hours and availability for "Home Checkup Service".</li>
              </ul>

              <h4>Steps for verification.</h4>
              <p>Your account needs to be approved in order to start your online scheduling service. Please enter your valid information and documents as mentioned in the registration form.</p>
              <ul>
                <li><TiTick />Please ensure that all information provided during registration is accurate.</li>
                <li><TiTick />You must submit relevant documents to support your credentials.</li>
                <li><TiTick />Respect patient confidentiality and ensure the security of their information.</li>
              </ul>
              <p>Our team will conduct a thorough verification process, including checking your license, educational background, work experience, and other credentials.</p>
            </div>
            <form action="" onSubmit={handleSubmit}>
              <div className="form-top">
                <h4>Doctor Registration</h4>
                <span className="progression-bar" style={{ width: `${calculateCompletionPercentage()}%` }}></span>
              </div>

              <label htmlFor="full-name">Full Name <span>*</span></label>
              <input type="text" id="full-name" placeholder="Full Name" onChange={(e) => setUserName(e.target.value)} required />

              <label htmlFor="email">Email Address <span>*</span></label>
              <input type="email" id="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />

              <label htmlFor="number">Phone Number <span>*</span></label>
              <input type="number" id="number" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />

              <label htmlFor="address">Address <span>*</span></label>
              <input type="text" id="address" placeholder="Address" onChange={(e) => setCity(e.target.value)} required />

              <label htmlFor="license">Medical License <span>*</span></label>
              <input type="file" id='license' onChange={(e) => setLicense(e.target.files[0])} required />

              <label htmlFor="password">Password <span>*</span></label>
              <input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />

              <label htmlFor="password2">Confirm Password <span>*</span></label>
              <input type="password" id="password2" placeholder="Confirm Password" onChange={(e) => setPassword2(e.target.value)} required />

              <button type="submit">Register</button>

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
                    <p className='resend-otp'>Didn't get code? <span onClick={resendOTP}>Resend</span></p>
                    <button type="button" onClick={() => verifyOTP()}>Verify</button>
                    <button type="button" className='cancle' onClick={() => setDisplayOTP(false)}>Cancle</button>
                  </div>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterDoctor