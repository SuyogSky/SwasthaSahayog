import React, { useEffect, useState } from 'react';
import './TimeSlot.scss'
import useAxios from '../../../../../utils/useAxios';
import ip from '../../../../../ip';
const TimeSlot = ({ onSelectTime, selectedDate='2024-03-09', doctorData  }) => {

    const axios = useAxios()
    const [approvedAppointmentTimes, setApprovedAppointmentTimes] = useState([]);
    useEffect(() => {
        // Fetch approved appointment times when the component mounts
        const fetchApprovedAppointmentTimes = async () => {
            if(selectedDate){
                try {
                    const response = await axios.get(ip + '/appointment/approved_appointment_times/', {
                        params: {
                            appointment_date: selectedDate, // Replace with the desired date
                        },
                    });
    
                    // Extract only the hour and minute from each time
                    const formattedTimes = response.data.map(time => time.substr(0, 5));
    
                    // Set the approved appointment times in state
                    setApprovedAppointmentTimes(formattedTimes);
                    console.log('approved times are:', formattedTimes);
                } catch (error) {
                    console.error('Error fetching approved appointment times:', error);
                }
            }
        };

        fetchApprovedAppointmentTimes();
    }, [selectedDate]);


    const [selectedTime, setSelectedTime] = useState(null);

    // Function to generate time slots with a 30-minute difference
    const generateTimeSlots = (startTime, endTime, interval) => {
        const timeSlots = [];
        let currentTime = new Date(`2024-03-13T${startTime}Z`); // Explicitly set time zone to UTC
        const endTimeObj = new Date(`2024-03-13T${endTime}Z`);

        while (currentTime <= endTimeObj) {
            const formattedTime = currentTime.toISOString().substr(11, 5); // Use 24-hour format
            // timeSlots.push(formattedTime);
            if (!approvedAppointmentTimes.includes(formattedTime)) {
                timeSlots.push(formattedTime);
            }
            currentTime.setMinutes(currentTime.getMinutes() + interval);
        }
        console.log(timeSlots);

        return timeSlots;
    };



    // Function to categorize time slots into morning, afternoon, and evening
    const categorizeTimeSlots = (timeSlots) => {
        const morningSlots = timeSlots.filter((time) => {
            const hour = parseInt(time.split(':')[0]);
            return hour > 0 && hour < 12;
        });

        const afternoonSlots = timeSlots.filter((time) => {
            const hour = parseInt(time.split(':')[0]);
            return hour >= 12 && hour < 17;
        });

        const eveningSlots = timeSlots.filter((time) => {
            const hour = parseInt(time.split(':')[0]);
            //   return hour >= 17 || (hour === 16 && parseInt(time.split(':')[1]) >= 30); // Adjusted condition
            return hour >= 17 && hour <= 24; // Adjusted condition
        });

        return { morningSlots, afternoonSlots, eveningSlots };
    };

    const handleTimeClick = (time) => {
        setSelectedTime(time);
        onSelectTime(time);
        console.log(selectedTime)
    };

    const morningOpeningHours = doctorData.opening_time || '00:00:00';
    const eveningClosingHours = doctorData.closing_time ||  '24:00:00';
    const timeInterval = 30;

    // Generate time slots
    const timeSlots = generateTimeSlots(morningOpeningHours, eveningClosingHours, timeInterval);

    // Categorize time slots
    const categorizedSlots = categorizeTimeSlots(timeSlots);

    return (
        <div className='time-selector'>
            <label htmlFor="">Appointment Time <span>*</span></label>
            <div className='slot-container'>
                <h5>Morning</h5>
                <div>
                    {categorizedSlots.morningSlots.map((time) => (
                        <button key={time}  className={`${selectedTime === time ? 'selected' : ''}`} onClick={() => handleTimeClick(time)} type='button'>
                            {time}
                        </button>
                    ))}
                </div>
                <h5>Afternoon</h5>
                <div>
                    {categorizedSlots.afternoonSlots.map((time) => (
                        <button key={time}  className={`${selectedTime === time ? 'selected' : ''}`} onClick={() => handleTimeClick(time)} type='button'>
                            {time}
                        </button>
                    ))}
                </div>
                <h5>Evening</h5>
                <div>
                    {categorizedSlots.eveningSlots.map((time) => (
                        <button key={time} className={`${selectedTime === time ? 'selected' : ''}`} onClick={() => handleTimeClick(time)} type='button'>
                            {time}
                        </button>
                    ))}
                </div>
            </div>
            {selectedTime && <p>Selected Time: {selectedTime}</p>}
        </div>
    );
};

export default TimeSlot;
