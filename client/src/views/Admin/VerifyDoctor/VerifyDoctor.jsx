import React, { useEffect, useState } from 'react'
import './VerifyDoctor.scss'
import { IoEyeOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const swal = require('sweetalert2')

function VerifyDoctor() {
    const history = useHistory()
    const axios = useAxios()
    const [doctors, setDoctors] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [rejectedDoctors, setRejectedDoctors] = useState([]);
    const [canceledDoctors, setCanceledDoctors] = useState([]);

    const [loading, setLoading] = useState(false)
    const fetchAllDoctor = async () => {
        setLoading(true);
        setDoctors([]);
        setPendingDoctors([]);
        setApprovedDoctors([]);
        setRejectedDoctors([]);
        setCanceledDoctors([]);

        try {
            const response = await axios.get(`${ip}/api/all-doctors/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.status === 200) {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
            }

            const data = response.data;
            setDoctors(data);
            setAllDoctors(data);
            setLoading(false);
            console.log(data)

            // Assuming you have state variables like this:
            data.forEach((item) => {
                if (!item.is_verified) {
                    setPendingDoctors((prevPending) => [...prevPending, item]);
                }
                if (item.is_verified) {
                    setApprovedDoctors((prevApproved) => [...prevApproved, item]);
                }
            });

            console.log('The Doctors are: ', data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle error state as needed
        }
    };
    useEffect(() => {
        fetchAllDoctor();
    }, []);

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const [isLoading, setIsLoading] = useState(false);
    const verifyThisDoctor = async (DoctorId) => {
        swal.fire({
            title: "Verify Doctor?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token'); // Replace with your actual Bearer token
                    const headers = {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json', // Adjust the content type if necessary
                    };

                    // Make an API request to approve the Doctor with the Bearer token in the headers
                    await axios.patch(`${ip}/api/doctors/${DoctorId}/verify/`, null, { headers });
                    swal.fire({
                        title: "Doctor Verified.",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                    })
                    fetchAllDoctor()
                    // Optionally, you can trigger a re-fetch or update the component state
                } catch (error) {
                    console.error('Error verifying Doctor:', error.response.data);
                    swal.fire({
                        title: error.response.data,
                        icon: "error",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                    })
                    // Handle the error, display a message, or redirect the user
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const [activeTab, setActiveTab] = useState('all')



    return (
        <div className='verify-doctor'>
            <div className="tab-bar-container">
                <ul>
                    <li className={`${activeTab === 'all' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('all')
                        fetchAllDoctor()
                    }}>All <span className="count">{allDoctors.length}</span></li>
                    <li className={`${activeTab === 'pending' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('pending')
                        setDoctors(pendingDoctors)
                    }}>Pending <span className="count">{pendingDoctors.length}</span></li>
                    <li className={`${activeTab === 'approved' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('approved')
                        setDoctors(approvedDoctors)
                    }}>Approved <span className="count">{approvedDoctors.length}</span></li>
                </ul>
            </div>
            <div className="table-container">
                <table className="Doctors">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>License</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors ? doctors.map((Doctor, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        <p>
                                            <div className="image" style={Doctor ? {
                                                backgroundImage: `url(${Doctor.image})`,
                                                backgroundPosition: 'center',
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                            } : null} onClick={() => history.push(`/profile/${Doctor.id}`)}>

                                            </div>
                                            {Doctor?.username}
                                        </p>
                                    </td>
                                    <td>{Doctor?.email}</td>
                                    <td>{Doctor?.phone}</td>
                                    <td>{Doctor?.address}</td>
                                    <td>
                                        <div className="license-image" style={Doctor ? {
                                            backgroundImage: `url(${Doctor.medical_license})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null}>

                                        </div>
                                    </td>
                                    <td className='action'><IoEyeOutline className='details' onClick={() => history.push(`/profile/${Doctor.id}`)} /> {!Doctor.is_verified && <p className='approve' onClick={() => verifyThisDoctor(Doctor.id)}><span>✔</span></p>}</td>
                                </tr>
                            )
                        })
                            :
                            null}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default VerifyDoctor