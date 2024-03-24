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
import Chat from '../Chat/Chat'
import Inbox from '../Chat/Inbox/Inbox'
import SearchUser from '../Chat/SearchUser/SearchUser'
import useAxios from '../../utils/useAxios'

function ClientProfileSettings() {
    const location = useLocation();
    const axios = useAxios()
    const isActiveLink = (path) => {
        return location.pathname === path;
    };
    const areAnyActiveLinks = (paths) => {
        return paths.some((path) => isActiveLink(path) || isParentLink(path));
    };
    const isParentLink = (path) => {
        return location.pathname.includes(path);
    };
    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
    const [clientData, setClientData] = useState(true)
    const fetchClientData = async () => {
        try {
            const response = await axios.get(`${ip}/api/client-profile/${currentUser.user_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setClientData(response.data);
            console.log('client detail is:', response.data);
        } catch (error) {
            console.error('Error fetching client details:', error);
        }
    };
    useEffect(() => {
        if (currentUser) {
            fetchClientData()
        }
    }, [])

    return (
        <section className={`client-settings-section ${areAnyActiveLinks(['/client/appointments', '/client/chat', '/client/search/']) ? 'p0' : ''} ${isParentLink('/client/inbox/') ? 'p0' : ''}`}>
            <div className="left">
                <SideBar clientData={clientData} />
            </div>
            <div className="right">

                <Switch>
                    <PrivateRoute path="/client/dashboard" element={<p>This is Dashboard</p>} />
                    <PrivateRoute path="/client/appointments" component={ViewAppointments} />
                    <PrivateRoute
                        path="/client/edit-profile"
                        render={(props) => (
                            <EditClientProfile {...props} clientData={clientData} fetchClientData={fetchClientData} />
                        )}
                    />

                    <PrivateRoute path='/client/chat' component={Chat} />
                    <PrivateRoute path='/client/inbox/:id' component={Inbox} />
                    <PrivateRoute path='/client/search/:username' component={SearchUser} />
                </Switch>
            </div>
        </section>
    )
}

export default ClientProfileSettings