import React, { useEffect, useState } from 'react'
import './ViewAppointment.scss'
import { IoEyeOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
const swal = require('sweetalert2')

function ViewAppointments() {
    const axios = useAxios()
    const [appointments, setAppointments] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const [rejectedAppointments, setRejectedAppointments] = useState([]);

    const [loading, setLoading] = useState(false)
    const fetchDoctorAppointments = async () => {
        setLoading(true)
        setAppointments([])
        setPendingAppointments([])
        setApprovedAppointments([])
        setRejectedAppointments([])
        try {
            const response = await fetch(`${ip}/appointment/client-appointments/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any authentication headers if needed
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
            }

            const data = await response.json();
            setAppointments(data);
            setAllAppointments(data)
            setLoading(false);

            // Assuming you have state variables like this:
            data.forEach((item) => {
                if (item.status === 'pending') {
                    setPendingAppointments(prevPending => [...prevPending, item]);
                }
                if (item.status === 'approved') {
                    setApprovedAppointments(prevApproved => [...prevApproved, item]);
                }
                if (item.status === 'rejected') {
                    setRejectedAppointments(prevRejected => [...prevRejected, item]);
                }
            });

            console.log("The appointments are: ", data)
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle error state as needed
        }
    };
    useEffect(() => {
        fetchDoctorAppointments();
    }, []);

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const [isLoading, setIsLoading] = useState(false);
    const approveAppointment = async (appointmentId) => {
        swal.fire({
            title: "Confirm Appointment?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Approve",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token'); // Replace with your actual Bearer token
                    const headers = {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json', // Adjust the content type if necessary
                    };

                    // Make an API request to approve the appointment with the Bearer token in the headers
                    await axios.patch(`${ip}/appointment/approve/${appointmentId}`, null, { headers });
                    swal.fire({
                        title: "Appointment Approved.",
                        icon: "success",
                        toast: true,
                        timer: 6000,
                        position: 'top-right',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                    })
                    fetchDoctorAppointments()
                    // Optionally, you can trigger a re-fetch or update the component state
                } catch (error) {
                    console.error('Error approving appointment:', error.response.data);
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
        <div className='view-doctor-appointments'>
            <div className="tab-bar-container">
                <ul>
                    <li className={`${activeTab === 'all'?'active':''}`} onClick={() => {
                        setActiveTab('all')
                        fetchDoctorAppointments()
                    }}>All <span className="count">{allAppointments.length}</span></li>
                    <li className={`${activeTab === 'pending'?'active':''}`} onClick={() => {
                        setActiveTab('pending')
                        setAppointments(pendingAppointments)
                    }}>Pending <span className="count">{pendingAppointments.length}</span></li>
                    <li className={`${activeTab === 'approved'?'active':''}`} onClick={() => {
                        setActiveTab('approved')
                        setAppointments(approvedAppointments)
                    }}>Approved <span className="count">{approvedAppointments.length}</span></li>
                    <li className={`${activeTab === 'rejected'?'active':''}`} onClick={() => {
                        setActiveTab('rejected')
                        setAppointments(rejectedAppointments)
                    }}>Rejected <span className="count">{rejectedAppointments.length}</span></li>
                </ul>
            </div>
            <div className="table-container">
                <table className="appointments">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Doctor</th>
                            <th>Speciality</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments ? appointments.map((appointment, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{appointment.doctor.username}</td>
                                    <td>{appointment.doctor.speciality}</td>
                                    <td className={`status ${appointment.status}`}><p>{capitalizeFirstLetter(appointment.status)}</p></td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td className='action'><IoEyeOutline className='details' /> <RxCrossCircled className='reject' title='Cancle' /></td>
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

export default ViewAppointments