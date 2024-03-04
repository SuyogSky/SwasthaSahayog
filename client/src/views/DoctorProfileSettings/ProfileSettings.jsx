import React, { useEffect, useState } from 'react'
import './ProfileSettings.scss'
import SideBar from './SideBar/SideBar'
import { Route, Switch, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import PrivateRoute from "../../utils/PrivateRoutes"
import Dashboard from "./Dashboard/Dashboard"
import EditDoctorProfile from './EditProfile/EditProfile'
import ip from '../../ip'
import ViewAppointments from './ViewAppointments/ViewAppointments'
import Chat from '../Chat/Chat'
import Inbox from '../Chat/Inbox/Inbox'

function ProfileSettings() {

    const location = useLocation();
    const isActiveLink = (path) => {
        return location.pathname === path;
      };

      const isParentLink = (path) => {
        return location.pathname.includes(path);
      };

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
    const [doctorData, setDoctorData] = useState(true)
    const fetchDoctorData = async () => {
        fetch(`${ip}/api/doctor-profile/${currentUser.user_id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(response => response.json())
            .then(data => {
                setDoctorData(data)
                console.log('doctor detail is: ', data)
            })
            .catch(error => console.error('Error fetching client details:', error));
    }
    useEffect(() => {
        if (currentUser) {
            fetchDoctorData()
        }
    }, [])

    const areAnyActiveLinks = (paths) => {
        return paths.some((path) => isActiveLink(path));
    };

    return (
        <section className={`profile-settings-section ${areAnyActiveLinks(['/doctor/appointments', '/doctor/chat'])?'p0':''} ${isParentLink('/doctor/inbox/')?'p0':''}`}>
            <div className="left">
                <SideBar doctorData={doctorData} />
            </div>
            <div className="right">
                <Switch>
                    {/* <Route component={EditDoctorProfile} path='/' /> */}
                    <PrivateRoute path='/doctor/dashboard' component={Dashboard} />
                    <PrivateRoute path='/doctor/appointments' component={ViewAppointments} />

                    <PrivateRoute
                        path="/doctor/edit-profile"
                        render={(props) => (
                            <EditDoctorProfile {...props} doctorData={doctorData} fetchDoctorData={fetchDoctorData} />
                        )}
                    />

                    <PrivateRoute path='/doctor/chat' component={Chat} />
                    <PrivateRoute path='/doctor/inbox/:id' component={Inbox} />
                </Switch>
            </div>
        </section>
    )
}

export default ProfileSettings