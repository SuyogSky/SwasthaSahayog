import React, { useEffect, useState } from 'react'
import './NearbyClinics.scss'
import NearbyDoctors from '../../../assets/Images/doctor-locations-icon.png'
import NearbyPharmacy from '../../../assets/Images/pharmacy-locations-icon.png'
import useAxios from '../../../utils/useAxios'
import ip from '../../../ip'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import NearbyClinicsMap from './Map/Map'

function NearbyClinics() {
    const axios = useAxios()
    const history = useHistory()
    const [doctors, setDoctors] = useState([]);
    const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))

    const currentDateTime = new Date();
    const currentHours = currentDateTime.getHours();
    const currentMinutes = currentDateTime.getMinutes();
    const currentSeconds = currentDateTime.getSeconds();

    const currentTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

    // function isWithinTimeRange(openingTime, closingTime) {
    //     const currentTime = new Date();
    //     const currentHours = currentTime.getHours();
    //     const currentMinutes = currentTime.getMinutes();
    //     const currentSeconds = currentTime.getSeconds();
    //     const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds}`;

    //     return currentTimeString >= openingTime && currentTimeString <= closingTime;
    // }

    function isWithinTimeRange(openingTime, closingTime) {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();
        const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds}`;

        const currentTotalSeconds = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        const openingTimeParts = openingTime?.split(':') || 0;
        const openingTotalSeconds = parseInt(openingTimeParts[0]) * 3600 + parseInt(openingTimeParts[1]) * 60 + parseInt(openingTimeParts[2]);

        const closingTimeParts = closingTime?.split(':') || 0;
        const closingTotalSeconds = parseInt(closingTimeParts[0]) * 3600 + parseInt(closingTimeParts[1]) * 60 + parseInt(closingTimeParts[2]);

        return currentTotalSeconds >= openingTotalSeconds && currentTotalSeconds <= closingTotalSeconds;
    }


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
        <section className="nearby-clinics">
            <div className="sidebar">
                <ul>
                    <li className='active'>
                        <img src={NearbyDoctors} alt="" />
                        <p>Nearby<br />Doctors</p>
                    </li>
                    <li onClick={() => history.push('/nearby-pharmacies')}>
                        <img src={NearbyPharmacy} alt="" />
                        <p>Nearby<br />Pharmacies</p>
                    </li>
                </ul>
            </div>

            <div className="clinic-lists-container">
                <h2>Nearby Clinics</h2>
                <div className="clinic-list">
                    {doctors ?
                        doctors.map((doctor) => {
                            return (
                                <>
                                    {
                                        // doctor.doctor.id != currentUser.id ?
                                        doctor.doctor.id == doctor.doctor.id ?
                                            <div className="doctor">
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
                                                        {/* <span>{doctor.average_rating ? doctor.average_rating > 1 ? doctor.average_rating + ' Stars' : doctor.average_rating + ' Star' : 'No Ratings'}</span> */}

                                                    </p>

                                                    <p className="field">{doctor.doctor.speciality || 'Speciality not set'}</p>

                                                    {/* <span className={`status ${isOpen ? 'open' : 'closed'}`}>
                                                        {isOpen ? 'Open' : 'Closed'}
                                                    </span> */}
                                                    {
                                                        isWithinTimeRange(doctor.doctor.opening_time, doctor.doctor.closing_time) ?
                                                            <span className='status open'>Open</span>
                                                            :
                                                            <span className='status closed'>Closed</span>
                                                    }
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

            <div className="map-container">
                <NearbyClinicsMap doctor={doctors} />
            </div>
        </section>
    )
}

export default NearbyClinics