import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../context/AuthContext'
import ClientProfile from './ClientProfile/ClientProfile'
import DoctorProfile from './DoctorProfile/DoctorProfile'
import { useParams } from 'react-router-dom'
import ip from '../../ip'
import useAxios from '../../utils/useAxios'
import PharmacistProfile from './PharmacistProfile/PharmacistProfile'


function Profile() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [visitedUserData, setVisitedUserData] = useState(null);
  const axios = useAxios()
  // Fetch client details from the backend API using the client ID
  const fetchUserData = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    };

    axios.get(`${ip}/api/user/${id}/`, config)
      .then(response => {
        const data = response.data;
        setVisitedUserData(data);
        console.log('Visited user is', data.role);
      })
      .catch(error => console.error('Error fetching client details:', error));
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  return (
    <>
      {visitedUserData && (
        <>
          {visitedUserData.role === 'client' ? <ClientProfile id={id} /> : 
          visitedUserData.role === 'doctor' ? <DoctorProfile id={id} /> : 
          visitedUserData.role === 'pharmacist' ? <PharmacistProfile id={id} /> : null}
        </>
      )}
    </>
  );
}

export default Profile