import React, { useEffect, useState } from 'react'
import './ClientProfileSettings.scss'
import SideBar from './SideBar/SideBar'
import { Link, Route, Switch, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import PrivateRoute from "../../utils/PrivateRoutes"
// import Dashboard from "./Dashboard/Dashboard"
// import EditDoctorProfile from './EditProfile/EditProfile'
import ip from '../../ip'
import EditClientProfile from './EditProfile/EditClientProfile'
import ViewAppointments from './ViewAppointments/ViewAppointments'

function ClientProfileSettings() {
    const location = useLocation();
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
    const [clientData, setClientData] = useState(true)
    const fetchClientData = async () => {
        fetch(`${ip}/api/client-profile/${currentUser.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setClientData(data)
                console.log('doctor detail is: ', data)
            })
            .catch(error => console.error('Error fetching client details:', error));
    }
    useEffect(() => {
        if (currentUser) {
            fetchClientData()
        }
    }, [])

    return (
        <section className={`client-settings-section ${isActiveLink('/client/appointments')?'p0':''}`}>
            <div className="left">
                <SideBar clientData={clientData} />
            </div>
            <div className="right">

                <Switch>
                    <PrivateRoute path="/client/dashboard" element={<p>This is Dashboard</p>} />
                    <PrivateRoute
                        path="/client/edit-profile"
                        render={(props) => (
                            <EditClientProfile {...props} clientData={clientData} fetchClientData={fetchClientData} />
                            )}
                    />
                    <PrivateRoute path="/client/appointments" component={ViewAppointments} />
                </Switch>
            </div>
        </section>
    )
}

export default ClientProfileSettings