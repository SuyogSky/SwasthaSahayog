import React from 'react'

import "./Services.scss"

import MapIcon from "../../../assets/Images/map-icon.png"
import DoctorIcon from "../../../assets/Images/doctor2.png"
import MedicineIcon from "../../../assets/Images/medicine-icon.png"
import AppointmentIcon from "../../../assets/Images/appointment-icon.png"
import { useHistory } from 'react-router-dom'
function Services() {
  const history = useHistory()
  return (
    <section className="services-section">
      <h2>Services</h2>
      <div className="container">
        <div className="map">
          <img src={MapIcon} alt="" />
          <p>Nearby clinics & pharmacies</p>
        </div>

        <div className="doctors" onClick={() => history.push(`/doctors`)}>
          <img src={DoctorIcon} alt="" />
          <p>Doctors</p>
        </div>

        <div className="medicine">
          <img src={MedicineIcon} alt="" />
          <p>Order Medicine</p>
        </div>

        <div className="appointments">
          <img src={AppointmentIcon} alt="" />
          <p>Book Appointments</p>
        </div>
      </div>
    </section>
  )
}

export default Services