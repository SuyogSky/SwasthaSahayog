import React, { useEffect, useState } from 'react'
import './Doctors.scss'
import { useHistory } from 'react-router-dom'
import { IoMdStar } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { MdAccessTime } from "react-icons/md";
import { MdOutlinePriceChange } from "react-icons/md";
import { LuExternalLink } from "react-icons/lu";
import { IoChatboxOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";

import ip from '../../ip';
import useAxios from '../../utils/useAxios';
function Doctors() {
    const history = useHistory()
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState([])
    const axios = useAxios()
    const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
    const sampleRatings = [
        { doctorId: 30, rating: 4 },
        { doctorId: 23, rating: 5 },
        { doctorId: 24, rating: 5 },
        { doctorId: 25, rating: 3 },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            const accessToken = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).access : null;

            if (accessToken) {
                try {
                    // const response = await axios.get(`${ip}/api/verified-doctors/`, {
                    const response = await axios.get(`${ip}/review/doctor/average-rating/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    console.log('Response is: ', response.data)
                    setDoctors(response.data)
                    // if (response.status === 200) {
                    //     const data = response.data;
                    //     const doctorsWithRatings = data.map((doctor) => ({
                    //         ...doctor,
                    //         ratings: sampleRatings.find((rating) => rating.doctorId === doctor.id)?.rating || 0,
                    //     }));
                    //     console.log('Doctors:', doctorsWithRatings);

                    //     setDoctors(doctorsWithRatings);
                    // } else {
                    //     console.error('Error fetching posts:', response.statusText);
                    // }
                } catch (error) {
                    console.error('Error fetching posts2:', error);
                }
            } else {
                console.error('Access token not found in local storage.');
            }
        };

        // Call the fetchPosts function
        fetchDoctors();
    }, []);


    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const parsedHours = parseInt(hours, 10);
        const period = parsedHours >= 12 ? 'PM' : 'AM';
        const formattedHours = parsedHours % 12 || 12;

        return `${formattedHours}:${minutes} ${period}`;
    };

    return (
        <section className="doctor-list-section">
            <div className="banner">
                <div className="text">
                    <h2>Meet Your Care Team</h2>
                    <p>Our esteemed team of healthcare professionals is here to guide you on your path to well-being. Scroll through our diverse list of doctors, each committed to delivering high-quality care tailored to your unique needs.</p>
                </div>
                <FaAngleDoubleDown className="float" />
            </div>

            <div className="doctors-main-container">
                <div className="top">
                    <h2>Our Top Doctors</h2>
                </div>
                <div className="doctor-list-container">
                    {doctors ?
                        doctors.map((doctor) => {
                            return (
                                <>
                                    {
                                        doctor.doctor.id != currentUser.id ?
                                            <div className="doctor">
                                                <span className="favourite">
                                                    <FaRegHeart />
                                                </span>
                                                <div className="image-container">
                                                    <div className="image" style={doctor ? {
                                                        backgroundImage: `url(${ip}${doctor.doctor.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                    } : null}>

                                                    </div>
                                                </div>
                                                <div className="details">
                                                    <h4 onClick={() => { history.push(`/profile/${doctor.doctor.id}`) }}>{doctor.doctor.username}</h4>
                                                    <p className="field">{doctor.doctor.speciality || 'Speciality not set'}</p>

                                                    <p className="ratings">
                                                        <div class="rating">
                                                            {[5, 4, 3, 2, 1].map((ratingValue) => (
                                                                <React.Fragment key={ratingValue}>
                                                                    <input
                                                                        value={ratingValue}
                                                                        name={`rating${doctor.doctor.id}`}
                                                                        id={`star${ratingValue}-${doctor.doctor.id}`}
                                                                        type="radio"
                                                                        checked={doctor.average_rating === ratingValue}
                                                                        readOnly
                                                                    // You can add an onChange handler here if needed
                                                                    />
                                                                    <label htmlFor={`star${ratingValue}-${doctor.doctor.id}`}></label>
                                                                </React.Fragment>
                                                            ))}
                                                        </div>


                                                        {/* <span>{doctor.average_rating} {doctor.average_rating > 1 ? 'Stars' : 'Star'}</span> */}
                                                        <span>{doctor.average_rating ? doctor.average_rating > 1 ? doctor.average_rating + ' Stars' : doctor.average_rating + ' Star': 'No Ratings'}</span>

                                                    </p>
                                                    <div className="info">
                                                        <p className="location"><GrLocation /><span>{doctor.doctor.address || 'Not Set'}</span></p>
                                                        <p className="service-time">
                                                            <MdAccessTime />
                                                            <span>
                                                                {doctor.doctor.opening_time || doctor.doctor.closing_time
                                                                    ? (doctor.doctor.opening_time ? formatTime(doctor.doctor.opening_time) : 'Not Set') +
                                                                    ' - ' +
                                                                    (doctor.doctor.closing_time ? formatTime(doctor.doctor.closing_time) : 'Not Set')
                                                                    : 'Not Set'}
                                                            </span>
                                                        </p>
                                                        <p className="service-charge"><MdOutlinePriceChange /><span>{doctor.doctor.service_charge ? 'Rs. '+doctor.doctor.service_charge : 'Not Set'}</span></p>
                                                    </div>
                                                </div>

                                                <div className="actions">
                                                    <span className="visit" title='View Profile'><LuExternalLink /></span>
                                                    <span className="chat" title='Chat'><IoChatboxOutline /></span>
                                                    <span className="book-appointment" title='Book Appointment' onClick={() => history.push('/book-appointment')}><FaRegCalendarCheck /></span>
                                                </div>
                                            </div>
                                        : null
                                    }
                                </>
                            )
                        })
                        :
                        null
                    }
                </div>
            </div>
        </section>
    )
}

export default Doctors