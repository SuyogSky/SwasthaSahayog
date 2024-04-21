import React, { useEffect, useState } from 'react'
import './ProfileSettings.scss'
import SideBar from './SideBar/SideBar'
import { Route, Switch, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import PrivateRoute from "../../utils/PrivateRoutes"
import ip from '../../ip'
import useAxios from '../../utils/useAxios'
import EditPharmacistProfile from './EditProfile/EditPharmacistProfile'
import Chat from '../Chat/Chat'
import Inbox from "../Chat/Inbox/Inbox"
import SearchUser from "../Chat/SearchUser/SearchUser"
import ViewOrders from './ViewOrders/ViewOrders'

function PharmacistProfileSettings() {

    const location = useLocation();
    const axios = useAxios()
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const isParentLink = (path) => {
        return location.pathname.includes(path);
    };

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
    
    const [pharmacistData, setPharmacistData] = useState(true)
    const fetchPharmacistData = async () => {
        try {
            const response = await axios.get(`${ip}/api/pharmacist-profile/${currentUser.user_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.status===200) {
                throw new Error(`Failed to fetch pharmacist data: ${response.statusText}`);
            }

            const data = response.data;
            setPharmacistData(data);
            console.log('Pharmacist detail is:', data);
        } catch (error) {
            console.error('Error fetching pharmacist details:', error);
            // Handle error state as needed
        }
    };
    useEffect(() => {
        if (currentUser) {
            fetchPharmacistData()
        }
    }, [])

    const areAnyActiveLinks = (paths) => {
        return paths.some((path) => isActiveLink(path) || isParentLink(path));
    };

    return (
        <section className={`profile-settings-section ${areAnyActiveLinks(['/pharmacist/appointments', '/pharmacist/chat', '/pharmacist/search/']) ? 'p0' : ''} ${isParentLink('/pharmacist/inbox/') ? 'p0' : ''}`}>
            <div className="left">
                <SideBar pharmacistData={pharmacistData} />
            </div>
            <div className="right">
                <Switch>
                    {/* <PrivateRoute path='/pharmacist/dashboard' component={Dashboard} /> */}
                    <PrivateRoute path='/pharmacist/orders' component={ViewOrders} />

                    <PrivateRoute
                        path="/pharmacist/edit-profile"
                        render={(props) => (
                            <EditPharmacistProfile {...props} pharmacistData={pharmacistData} fetchPharmacistData={fetchPharmacistData} />
                        )}
                    />

                    <PrivateRoute path='/pharmacist/chat' component={Chat} />
                    <PrivateRoute path='/pharmacist/inbox/:id' component={Inbox} />
                    <PrivateRoute path='/pharmacist/search/:username' component={SearchUser} />
                </Switch>
            </div>
        </section>
    )
}

export default PharmacistProfileSettings