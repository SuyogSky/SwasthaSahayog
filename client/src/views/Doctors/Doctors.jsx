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
function Doctors() {
    const history = useHistory()
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState([])
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
                    const response = await fetch(`${ip}/api/verified-doctors/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setDoctors(data)
                        const doctorsWithRatings = data.map((doctor) => ({
                            ...doctor,
                            ratings: sampleRatings.find((rating) => rating.doctorId === doctor.id)?.rating || 0,
                        }));
                        console.log('Doctors:', doctorsWithRatings);

                        setDoctors(doctorsWithRatings);
                    } else {
                        console.error('Error fetching posts:', response.statusText);
                    }
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
                            console.log(doctor.image)
                            return (
                                <div className="doctor">
                                    <span className="favourite">
                                        <FaRegHeart />
                                    </span>
                                    <div className="image-container">
                                        <div className="image" style={doctor ? {
                                            backgroundImage: `url(${doctor.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>

                                        </div>
                                    </div>
                                    <div className="details">
                                        <h4 onClick={() => { history.push(`/profile/${doctor.id}`) }}>{doctor.username}</h4>
                                        <p className="field">{doctor.speciality || 'Speciality not set'}</p>

                                        <p className="ratings">
                                            <div class="rating">
                                                {/* <input value="5" name={`rating${doctor.id}`} id="star5" type="radio" checked={doctor.rating = 5} />
                                                <label for="star5"></label>
                                                <input value="4" name={`rating${doctor.id}`} id="star4" type="radio" checked={doctor.rating = 4} />
                                                <label for="star4"></label>
                                                <input value="3" name={`rating${doctor.id}`} id="star3" type="radio" checked={doctor.rating = 3} />
                                                <label for="star3"></label>
                                                <input value="2" name={`rating${doctor.id}`} id="star2" type="radio" checked={doctor.rating = 2} />
                                                <label for="star2"></label>
                                                <input value="1" name={`rating${doctor.id}`} id="star1" type="radio" checked={doctor.rating = 1} />
                                                <label for="star1"></label> */}

                                                {[5, 4, 3, 2, 1].map((ratingValue) => (
                                                    <React.Fragment key={ratingValue}>
                                                        <input
                                                            value={ratingValue}
                                                            name={`rating${doctor.id}`}
                                                            id={`star${ratingValue}-${doctor.id}`}
                                                            type="radio"
                                                            checked={doctor.ratings === ratingValue}
                                                            readOnly
                                                        // You can add an onChange handler here if needed
                                                        />
                                                        <label htmlFor={`star${ratingValue}-${doctor.id}`}></label>
                                                    </React.Fragment>
                                                ))}
                                            </div>


                                            <span>5 Stars</span>

                                        </p>
                                        <div className="info">
                                            <p className="location"><GrLocation /><span>{doctor.address || 'Not Set'}</span></p>
                                            <p className="service-time">
                                                <MdAccessTime />
                                                <span>
                                                    {doctor.opening_time || doctor.closing_time
                                                        ? (doctor.opening_time ? formatTime(doctor.opening_time) : 'Not Set') +
                                                        ' - ' +
                                                        (doctor.closing_time ? formatTime(doctor.closing_time) : 'Not Set')
                                                        : 'Not Set'}
                                                </span>
                                            </p>
                                            <p className="service-charge"><MdOutlinePriceChange /><span>Rs. 1000</span></p>
                                        </div>
                                    </div>

                                    <div className="actions">
                                        <span className="visit" title='View Profile'><LuExternalLink /></span>
                                        <span className="chat" title='Chat'><IoChatboxOutline /></span>
                                        <span className="book-appointment" title='Book Appointment' onClick={() => history.push('/book-appointment')}><FaRegCalendarCheck /></span>
                                    </div>
                                </div>
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