  import React, { useContext, useEffect, useState } from 'react'
  import AuthContext from '../../context/AuthContext'
  import ClientProfile from './ClientProfile/ClientProfile'
  import DoctorProfile from './DoctorProfile/DoctorProfile'
  import { useParams } from 'react-router-dom'
  import ip from '../../ip'


  function Profile() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
  
    const [loading, setLoading] = useState(false);
    const [visitedUserData, setVisitedUserData] = useState(null);
  
    // Fetch client details from the backend API using the client ID
    const fetchUserData = () => {
      fetch(`${ip}/api/user/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      })
        .then(response => response.json())
        .then(data => {
          setVisitedUserData(data);
          console.log('visited user is', data.role);
        })
        .catch(error => console.error('Error fetching client details:', error));
    }
  
    useEffect(() => {
      fetchUserData();
    }, [id]);
  
    return (
      <>
        {visitedUserData && (
          <>
            {visitedUserData.role === 'client' ? <ClientProfile id={id} /> :
              visitedUserData.role === 'doctor' ? <DoctorProfile id={id} /> : null}
          </>
        )}
      </>
    );
  }
  
  export default Profile