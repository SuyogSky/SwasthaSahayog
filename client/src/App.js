import React, { useContext, useEffect, useState } from 'react'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import PrivateRoute from "./utils/PrivateRoutes"
import AuthContext, { AuthProvider } from './context/AuthContext'

import HomePage from "./views/LandingPage/LandingPage"
// import RegisterPage from "./views/RegisterPage"
import RegisterPage from "./views/UserAccounts/Register/Register"
// import LoginPage from "./views/LoginPage"
import LoginPage from './views/UserAccounts/Login/Login'
// import NavBar from "./views/NavBar"
import NavBar from './views/NavBar/NavBar'
import ClientProfile from './views/Profile/ClientProfile/ClientProfile'
// import Posts from './views/Forum/Post/Posts'
import Posts from './views/Posts/Posts'
import AddPost from './views/Forum/Post/AddPost'
import RegisterDoctor from './views/UserAccounts/RegisterDoctor/RegisterDoctor'
import DoctorProfile from './views/Profile/DoctorProfile/DoctorProfile'
import { jwtDecode } from 'jwt-decode'
import Profile from './views/Profile/Profile'
import Doctors from './views/Doctors/Doctors'
import ProfileSettings from './views/DoctorProfileSettings/ProfileSettings'
import ClientProfileSettings from './views/ClientProfileSettings/ClientProfileSettings'
import BookAppointment from './views/BookAppointment/BookAppointment'
import Dashboard from './views/DoctorProfileSettings/Dashboard/Dashboard'
import ChatComponent from './Components/ChatComponent'
import PostDetail from './views/Posts/PostDetail/PostDetail'
import UserPostDetail from './views/Profile/UserPosts/PostDetail/PostDetail'
import NearbyClinics from './views/Nearby/NearbyClinics/NearbyClinics'
import RegisterPharmacy from './views/UserAccounts/RegisterPharmacy/RegisterPharmacy'
import PharmacistProfileSettings from './views/PharmacistProfileSettings/ProfileSettings'
import NearbyPharmacies from './views/Nearby/NearbyPharmacies/NearbyPharmacies'
import MedicineRemainder from './views/MedicineRemainder/MedicineRemainder'

function App() {
  // const { user } = useContext(AuthContext)
  const [user, setUser] = useState()
  useEffect(() => {
    if (sessionStorage.getItem('currentUser')) {
      setUser(sessionStorage.getItem('currentUser'))
    }
  }, [sessionStorage])



  const handleAddPost = (postData) => {
    // Your logic to handle adding a post
    console.log('Adding post:', postData);
  };
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Switch>
          <Route component={HomePage} path="/" exact />
          <Route component={LoginPage} path="/login" />
          <Route component={RegisterPage} path="/register" />
          <Route component={RegisterDoctor} path="/register-doctor" />
          <Route component={RegisterPharmacy} path="/register-pharmacy" />
          <Route component={ChatComponent} path="/test-chat" />
          <Route component={MedicineRemainder} path="/remainder" />

          <PrivateRoute component={Doctors} path='/doctors' />
          <PrivateRoute component={ProfileSettings} path='/doctor' />

          <PrivateRoute component={NearbyClinics} path='/nearby-clinics' />
          <PrivateRoute component={NearbyPharmacies} path='/nearby-pharmacies' />

          <PrivateRoute component={Profile} path='/profile/:id' />
          
          <PrivateRoute component={BookAppointment} path='/book-appointment' />

          <PrivateRoute component={ClientProfileSettings} path='/client' />
          
          <PrivateRoute component={PharmacistProfileSettings} path='/pharmacist' />


          {user && (
            <PrivateRoute component={
              user.role == 'client' ? ClientProfile
                :
                user.role == 'doctor' ? DoctorProfile
                  :
                  null
            } path="/user-profile/:id" exact />
          )}
          
          <PrivateRoute component={Posts} path="/posts" exact />
          <PrivateRoute component={PostDetail} path="/post-detail/:post_id" />
          <PrivateRoute component={UserPostDetail} path="/user-post-detail/:post_id" />



          {/* <PrivateRoute
            path="/posts"
            exact
            render={(props) => (
              <AddPost {...props} onAddPost={handleAddPost} />
            )}
          /> */}

        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App