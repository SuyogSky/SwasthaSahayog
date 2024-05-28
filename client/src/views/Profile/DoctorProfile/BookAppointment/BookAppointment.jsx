import React, { useState } from 'react'
import './BookAppointment.scss'
import useAxios from '../../../../utils/useAxios'
import ip from '../../../../ip'
import DateSelector from './DateSelector/DateSelector'
import TimeSlot from './TimeSlot/TimeSlot'


const swal = require('sweetalert2')
function BookAppointment({ doctorData }) {
    const axios = useAxios()
    const access = localStorage.getItem('token')
    const currentUser = JSON.parse(localStorage.getItem('loggedInUser'))

    const [appointmentDate, setAppointmentDate] = useState()
    const [appointmentTime, setAppointmentTime] = useState()
    const [appointmentComment, setAppointmentComment] = useState()

    const handleDateSelection = (date) => {
        setAppointmentDate(date);
        console.log('selected Date is: ', date)
    };
    const handleTimeSelection = (time) => {
        setAppointmentTime(time);
    };
    const bookAppointment = async (e) => {
        e.preventDefault();

        if (appointmentDate, appointmentTime) {
            const newAppointment = {
                doctor: doctorData.id,
                date: appointmentDate,
                time: appointmentTime,
                comments: appointmentComment,
                status: 'pending',
            };
            console.log(newAppointment)

            try {
                const response = await axios.post(`${ip}/appointment/`, newAppointment, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                }).then((response) => {
                    console.log('the response is: ', response)
                    if (response.data.success === 1) {
                        // The appointment was successfully created
                        console.log('Appointment added successfully:', response);
                        swal.fire({
                            title: response.data.message,
                            icon: "success",
                            toast: true,
                            timer: 3000,
                            position: "top-right",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                        });
                        const currentDate = new Date();
                        handleDateSelection(currentDate.toISOString().split('T')[0]);
                        setAppointmentTime('')
                        setAppointmentComment('')
                    } else {
                        // There was an issue with the request, handle it here
                        console.error('Error adding Appointment:', response.data.message);
                        swal.fire({
                            title: response.data.message,
                            icon: "warning",
                            toast: true,
                            timer: 3000,
                            position: "top-right",
                            timerProgressBar: true,
                            showConfirmButton: false,
                            showCloseButton: true,
                        });
                    }
                });
            } catch (error) {
                // An error occurred while making the request
                console.error('Error adding appointment:', error.response);
                // if(error.)
                // Handle the error (e.g., show an error message to the user)
                swal.fire({
                    title: 'Permission not allowed.',
                    icon: "error",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
        else{
            swal.fire({
                title: 'Please enter date and time.',
                icon: "warning",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }



    };

    console.log('Doctor Data is : ', doctorData)

    return (
        <>
            <div className="left">
                <div className="client-information information">
                    <h4>Client Information</h4>
                    <div className="info">
                        <div className="image" style={currentUser ? {
                            backgroundImage: `url(${currentUser.image})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        } : null}>

                        </div>
                        <div className="details">
                            <p>{currentUser.username}</p>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="doctor-details information">
                    <h4>Doctor Information</h4>
                    <div className="info">
                        <div className="image" style={doctorData ? {
                            backgroundImage: `url(${doctorData.image})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        } : null}>

                        </div>
                        <div className="details">
                            <p>{doctorData.username}</p>
                            <span>{doctorData.speciality}</span>
                        </div>
                    </div>

                    <p className="working-hours"><span>Available from: </span>{doctorData.opening_time} - {doctorData.closing_time}</p>
                </div>
            </div>

            <div className="appointment-form-container">
                <h6>Book Appointment Form</h6>
                <form action="" onSubmit={bookAppointment}>
                    <DateSelector onSelectDate={handleDateSelection} />

                    <TimeSlot onSelectTime={handleTimeSelection} selectedDate={appointmentDate} doctorData={doctorData} />
                    {/* <input type="date" onChange={(e) => console.log(e.target.value)} />
                                                <div className="time">
                                                    <label htmlFor="time">Appointment Time <span>*</span></label>
                                                    <input type="time" id="time" onChange={(e) => setAppointmentTime(e.target.value)} value={appointmentTime} />
                                                </div> */}

                    <div className="comment">
                        <label htmlFor="comment">Comment</label>
                        <textarea name="comment" id="comment" onChange={(e) => setAppointmentComment(e.target.value)} value={appointmentComment}></textarea>
                    </div>

                    <button type="submit">Book</button>
                </form>
            </div>
        </>
    )
}

export default BookAppointment