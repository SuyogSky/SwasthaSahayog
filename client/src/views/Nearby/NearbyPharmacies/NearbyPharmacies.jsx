import React, { useEffect, useState } from 'react'
import './NearbyPharmacies.scss'
import NearbyDoctors from '../../../assets/Images/doctor-locations-icon.png'
import NearbyPharmacy from '../../../assets/Images/pharmacy-locations-icon.png'
import useAxios from '../../../utils/useAxios'
import ip from '../../../ip'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import NearbyClinicsMap from './Map/Map'

function NearbyPharmacies() {
    const axios = useAxios()
    const history = useHistory()
    const [pharmacies, setPharmacies] = useState([]);
    const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))

    const currentDateTime = new Date();
    const currentHours = currentDateTime.getHours();
    const currentMinutes = currentDateTime.getMinutes();
    const currentSeconds = currentDateTime.getSeconds();

    const currentTime = `${currentHours}:${currentMinutes}:${currentSeconds}`;

    function isWithinTimeRange(openingTime, closingTime) {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const currentSeconds = currentTime.getSeconds();
        const currentTimeString = `${currentHours}:${currentMinutes}:${currentSeconds}`;
    
        return currentTimeString >= openingTime && currentTimeString <= closingTime;
    }

    useEffect(() => {
        const fetchPharmacies = async () => {
            const accessToken = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).access : null;

            if (accessToken) {
                try {
                    // const response = await axios.get(`${ip}/api/verified-pharmacies/`, {
                    const response = await axios.get(`${ip}/api/verified-pharmacies/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    console.log('Response is: ', response.data)
                    setPharmacies(response.data)
                } catch (error) {
                    console.error('Error fetching pharmacies:', error);
                }
            } else {
                console.error('Access token not found in local storage.');
            }
        };

        // Call the fetchPosts function
        fetchPharmacies();
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
                    <li onClick={() => history.push('/nearby-clinics')}>
                        <img src={NearbyDoctors} alt="" />
                        <p>Nearby<br />Doctors</p>
                    </li>
                    <li className='active'>
                        <img src={NearbyPharmacy} alt="" />
                        <p>Nearby<br />Pharmacies</p>
                    </li>
                </ul>
            </div>

            <div className="clinic-lists-container">
                <h2>Nearby Pharmacies</h2>
                <div className="clinic-list">
                    {pharmacies ?
                        pharmacies.map((pharmacy) => {
                            return (
                                <>
                                    {
                                        // pharmacy.id != currentUser.id ?
                                        pharmacy.id == pharmacy.id ?
                                            <div className="doctor">
                                                <div className="image-container">
                                                    <div className="image" style={pharmacy ? {
                                                        backgroundImage: `url(${pharmacy.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                    } : null}>

                                                    </div>
                                                </div>

                                                <div className="details">
                                                    <h4 onClick={() => { history.push(`/profile/${pharmacy.id}`) }}>{pharmacy.username}</h4>

                                                    {/* <p className="ratings">
                                                        <div class="rating">
                                                            {[5, 4, 3, 2, 1].map((ratingValue) => (
                                                                <React.Fragment key={ratingValue}>
                                                                    <input
                                                                        value={ratingValue}
                                                                        name={`rating${pharmacy.id}`}
                                                                        id={`star${ratingValue}-${pharmacy.id}`}
                                                                        type="radio"
                                                                        checked={doctor.average_rating === ratingValue}
                                                                        readOnly
                                                                    // You can add an onChange handler here if needed
                                                                    />
                                                                    <label htmlFor={`star${ratingValue}-${pharmacy.id}`}></label>
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </p> */}

                                                    <p className="field">{pharmacy.phone || 'Contact not set'}</p>

                                                    {/* <span className={`status ${isOpen ? 'open' : 'closed'}`}>
                                                        {isOpen ? 'Open' : 'Closed'}
                                                    </span> */}
                                                    {
                                                        isWithinTimeRange(pharmacy.opening_time, pharmacy.closing_time) ?
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
                <NearbyClinicsMap pharmacies={pharmacies} />
            </div>
        </section>
    )
}

export default NearbyPharmacies