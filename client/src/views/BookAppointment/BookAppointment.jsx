import React, { useEffect, useState } from "react";
import './BookAppointment.scss'

import { FaAngleDoubleDown } from "react-icons/fa";
import NearbyDoctors from "../Doctors/NearbyDoctors/NearbyDoctors";
const BookAppointment = () => {
    const [currentUser, setCurrentUser] = useState()
    useEffect(() => {
        const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
        console.log(currentUser)
        setCurrentUser(currentUser || null)
    }, [])

    return (
        <>
            {currentUser ?
                <section className="book-appointment-section">
                    <div className="banner">
                        <div className="text">
                            <h2>Book Appointment</h2>
                            <p>Take control of your health journey – book appointments with ease. Your time is valuable, and so is your well-being. Let us streamline your path to optimal health through hassle-free scheduling and expert care.</p>
                        </div>
                        <FaAngleDoubleDown className="float" />
                    </div>
                    {/* <NearbyDoctors /> */}
                    <div className="book-appointment-form-container">
                        <form action="">
                            <div className="client-name">
                                <label htmlFor="client-name">Client Name <span>*</span></label>
                                <input type="text" name="client-name" id="client-name" value={currentUser.username} />
                            </div>

                            <div className="department">
                                <label htmlFor="department">Department <span>*</span></label>
                                <select name="department" id="option">
                                    <option value="">Select Department</option>
                                    <option value="eye">Eye</option>
                                    <option value="teeth">Teeth</option>
                                    <option value="skin">Skin</option>
                                </select>
                            </div>

                            <div className="doctor">
                                <label htmlFor="doctor">Doctor <span>*</span></label>
                                <select name="doctor" id="option">
                                    <option value="">Select Doctor</option>
                                    <option value="eye">Doctor 1</option>
                                    <option value="teeth">Doctor 2</option>
                                    <option value="skin">Doctor 3</option>
                                </select>
                            </div>

                            <div className="phone">
                                <label htmlFor="phone">Phone <span>*</span></label>
                                <input type="number" name="phone" id="phone" value={currentUser.phone}/>
                            </div>

                            <div className="email">
                                <label htmlFor="email">Email Address <span>*</span></label>
                                <input type="email" name="email" id="email" value={currentUser.email} />
                            </div>

                            <div className="comments">
                                <label htmlFor="comment">Comment <span>*</span></label>
                                <textarea name="comment" id="comment"></textarea>
                            </div>
                        </form>
                    </div>
                </section>
                :
                null
            }
        </>
    )
}

export default BookAppointment