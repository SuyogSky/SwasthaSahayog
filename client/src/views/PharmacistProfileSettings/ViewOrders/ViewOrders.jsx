import React, { useEffect, useState } from 'react'
import './ViewOrders.scss'
import { IoEyeOutline } from "react-icons/io5";
import { RxCrossCircled } from "react-icons/rx";
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
const swal = require('sweetalert2')

function ViewOrders() {
    const axios = useAxios()
    const history = useHistory()


    const [appointments, setAppointments] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [pendingAppointments, setPendingAppointments] = useState([]);
    const [approvedAppointments, setApprovedAppointments] = useState([]);
    const [rejectedAppointments, setRejectedAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);

    const [loading, setLoading] = useState(false)
    const fetchDoctorAppointments = async () => {
        setLoading(true);
        setAppointments([]);
        setPendingAppointments([]);
        setApprovedAppointments([]);
        setRejectedAppointments([]);
        setCanceledAppointments([])

        try {
            const response = await axios.get(`${ip}/order/pharmacy-orders/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.status == 200) {
                throw new Error(`Failed to fetch doctor appointments: ${response.statusText}`);
            }

            const data = response.data;
            console.log(data)
            // setAppointments(data);
            // setAllAppointments(data);
            setLoading(false);
            setActiveTab('all')

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
                if (item.status === 'canceled') {
                    setCanceledAppointments(prevCanceled => [...prevCanceled, item]);
                }
            });

            console.log("The appointments are: ", data);
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
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
                        text: 'Client is notified.',
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


    const rejectAppointment = async (appointmentId) => {
        swal.fire({
            title: "Reject Appointment?",
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

                    // Make an API request to approve the appointment with the Bearer token in the headers
                    await axios.patch(`${ip}/appointment/reject/${appointmentId}`, null, { headers });
                    swal.fire({
                        title: "Appointment Rejected.",
                        text: 'Client is notified.',
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
                    console.error('Error rejecting appointment:', error.response.data);
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



    function calculateAge(dateOfBirth) {
        const dob = new Date(dateOfBirth);
        const now = new Date();
        let age = now.getFullYear() - dob.getFullYear();
        const monthDiff = now.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

    return (
        <div className='view-doctor-appointments'>
            <div className="tab-bar-container">
                <ul>
                    <li className={`${activeTab === 'all' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('all')
                        fetchDoctorAppointments()
                    }}>All <span className="count">1</span></li>
                    <li className={`${activeTab === 'pending' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('pending')
                        setAppointments(pendingAppointments)
                    }}>Pending <span className="count">{pendingAppointments.length}</span></li>
                    <li className={`${activeTab === 'approved' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('approved')
                        setAppointments(approvedAppointments)
                    }}>Approved <span className="count">{approvedAppointments.length}</span></li>
                    <li className={`${activeTab === 'rejected' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('rejected')
                        setAppointments(rejectedAppointments)
                    }}>Rejected <span className="count">{rejectedAppointments.length}</span></li>
                    <li className={`${activeTab === 'canceled' ? 'active' : ''}`} onClick={() => {
                        setActiveTab('canceled')
                        setAppointments(canceledAppointments)
                    }}>Canceled <span className="count">{canceledAppointments.length}</span></li>
                </ul>
            </div>
            <div className="table-container">
                <table className="appointments">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Order Image</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Suyog Sky</td>
                        <td>4/24/2024</td>
                        <td></td>
                        <td className='action'><IoEyeOutline className='details' /> <p className='approve'><span>✔</span></p> <RxCrossCircled className='reject' /></td>
                    </tr>
                        {appointments ? appointments.map((appointment, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td className='username' title={appointment.client.email}>
                                        <div className="image" style={appointment.client ? {
                                            backgroundImage: `url(${appointment.client.image})`,
                                            backgroundPosition: 'center',
                                            backgroundSize: 'cover',
                                            backgroundRepeat: 'no-repeat',
                                        } : null} onClick={() => history.push(`/profile/${appointment.client.id}`)}>

                                        </div>
                                        <p onClick={() => history.push(`/profile/${appointment.client.id}`)}>{appointment.client.username}</p>
                                    </td>
                                    <td>{appointment.client.date_of_birth ? calculateAge(appointment.client.date_of_birth) : <span>Null</span>}</td>
                                    <td>{appointment.client.gender?appointment.client.gender:<span>Null</span>}</td>
                                    <td className={`status ${appointment.status}`}><p>{capitalizeFirstLetter(appointment.status)}</p></td>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td className='action'><IoEyeOutline className='details' /> {appointment.status == 'pending' && <p className='approve' onClick={() => approveAppointment(appointment.id)}><span>✔</span></p>} <RxCrossCircled className='reject' onClick={() => rejectAppointment(appointment.id)} /></td>
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

export default ViewOrders