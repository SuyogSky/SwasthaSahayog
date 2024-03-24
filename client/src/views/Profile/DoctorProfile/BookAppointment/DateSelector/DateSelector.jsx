import React, { useEffect, useState } from 'react'
import './DateSelector.scss'
const DateSelector = ({ onSelectDate }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // Set the default selected date to the current date when the component mounts
        const currentDate = new Date();
        setSelectedDate(currentDate);
        onSelectDate(currentDate.toISOString().split('T')[0]);
    }, []);

    const handleDateClick = (date) => {

    };

    const handleDateChange = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setSelectedDate(new Date(formattedDate));
        onSelectDate(formattedDate);
    };

    // Helper function to get short day names (Sun, Mon, Tue, ...)
    const getShortDayName = (date) => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayIndex = date.getDay();
        return dayNames[dayIndex];
    };

    // Helper function to get the day of the month
    const getDayOfMonth = (date) => {
        return date.getDate();
    };

    const getCurrentMonth = () => {
        const currentDate = new Date();
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthIndex = currentDate.getMonth();
        return monthNames[monthIndex];
    };

    const renderDateCards = () => {
        const dateCards = [];
        const currentDate = new Date();

        for (let i = 0; i < 7; i++) {
            const nextDate = new Date();
            nextDate.setDate(currentDate.getDate() + i);

            const isSelected = selectedDate && selectedDate.getTime() === nextDate.getTime();
            const cardClasses = isSelected ? 'date-card selected' : 'date-card';
            console.log(selectedDate?.getDate() === nextDate.getDate())
            dateCards.push(
                <div
                    key={i}
                    className={`date-card ${selectedDate?.getDate() === nextDate.getDate() ? 'selected' : ''}`}
                    onClick={() => handleDateChange(nextDate)}
                >
                    <span className="day">{getShortDayName(nextDate)}</span>
                    <span className="date">{getDayOfMonth(nextDate)}</span>
                </div>
            );
        }

        return dateCards;
    };

    return (
        <div className="date-selector">
            <label htmlFor="">Appointment Date <span>*</span></label>
            <p className="month">{getCurrentMonth()}</p>
            <div className="date-cards-container">{renderDateCards()}</div>
        </div>
    );
};

export default DateSelector