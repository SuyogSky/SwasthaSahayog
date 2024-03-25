import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { RiFullscreenFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { PiWarningCircleFill } from "react-icons/pi";
import { FcApproval } from "react-icons/fc";
import './EditProfile.scss'
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
import { LuInfo } from "react-icons/lu";
import Map from './Location/Map';
const swal = require('sweetalert2')
function EditDoctorProfile({ doctorData, fetchDoctorData }) {

  const axios = useAxios()
  // const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
  // const [doctorData, setDoctorData] = useState(true)
  // const fetchDoctorData = async () => {
  //   fetch(`${ip}/api/doctor-profile/${currentUser.user_id}/`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //     }
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       setDoctorData(data)
  //       setProfilePicture(data.image)
  //       console.log('doctor detail is: ', data)
  //     })
  //     .catch(error => console.error('Error fetching client details:', error));
  // }
  useEffect(() => {
    if (doctorData) {
      // fetchDoctorData()
      setProfilePicture(doctorData.image)
      setLicenseDisplay(doctorData.medical_license)
      setUserName(doctorData.username)
      setEmail(doctorData.email)
      setPhone(doctorData.phone)
      setAddress(doctorData.address)
      setOpeningTime(doctorData.opening_time)
      setClosingTime(doctorData.closing_time)
      setSpeciality(doctorData.speciality)
      setBioText(doctorData.bio || '')
      setMedicalBackgroundText(doctorData.medical_background || '')
      setAppointmentDuration(doctorData.appointment_duration)
      setServiceCharge(doctorData.service_charge)
      setHomeCheckupService(doctorData.home_checkup_service)
    }
  }, [doctorData])


  // <----------To Update Profile Picture--------->
  const [profilePicture, setProfilePicture] = useState();
  const [profileImage, setProfileImage] = useState()
  const [viewFullImage, setViewFullImage] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const cancleClicked = () => {
    setProfilePicture(doctorData.image)
    setProfileImage()
  }
  const updateProfilePicture = async (e) => {
    e.preventDefault()
    swal.fire({
      title: "Are You Sure?",
      text: "Do you want to update your profile picture?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (!profileImage) {
          console.error('No image file provided');
          return;
        }

        const formData = new FormData();
        formData.append('image', profileImage);

        try {
          await axios.patch(`${ip}/api/update-picture/${doctorData.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          // Handle success
          console.log('Profile picture updated successfully');
          swal.fire({
            title: "Profile picture updated successfully.",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
          fetchDoctorData()
          setProfileImage()

        } catch (error) {
          // Handle error
          console.error('Error updating profile picture:', error);
          swal.fire({
            text: `Error: ${error}`,
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
      else {
        cancleClicked()
      }
    });
  };


  // <----------To Edit Personal Details---------->
  const [userName, setUserName] = useState(doctorData.username)
  const [email, setEmail] = useState(doctorData.email)
  const [phone, setPhone] = useState(doctorData.phone)
  const [address, setAddress] = useState(doctorData.address)
  const [openingTime, setOpeningTime] = useState(doctorData.opening_time)
  const [closingTime, setClosingTime] = useState(doctorData.closing_time)
  const [speciality, setSpeciality] = useState(doctorData.speciality)
  const [bioText, setBioText] = useState(doctorData?.bio || ''); // Initialize with an empty string if doctorData or bio is undefined
  const [medicalBackgroundText, setMedicalBackgroundText] = useState(doctorData?.medical_background || ''); // Initialize with an empty string if doctorData or bio is undefined
  const [homeCheckupService, setHomeCheckupService] = useState(doctorData?.home_checkup_service)
  const [medicalLicense, setMedicalLicense] = useState()

  const [appointmentDuration, setAppointmentDuration] = useState(doctorData?.appointment_duration)
  const [serviceCharge, setServiceCharge] = useState(doctorData?.service_charge)


  const textareaRef = useRef(null);
  const medicalBackgroundRef = useRef(null);
  const maxCharacters = 200;
  const maxMBCharacters = 300;
  const [isEditing, setEditing] = useState(false);
  const [isMBEditing, setMBEditing] = useState(false);

  const [disableSave, setDisableSave] = useState(false);
  const [disableUpdate, setDisableUpdate] = useState(false);
  useEffect(() => {
    if (textareaRef.current) {
      const newHeight = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.style.height = newHeight;
    }
    setDisableSave(bioText.length > maxCharacters);

    if (medicalBackgroundRef.current) {
      const newHeight = medicalBackgroundRef.current.scrollHeight + 'px';
      medicalBackgroundRef.current.style.height = newHeight;
    }
    setDisableUpdate(medicalBackgroundText.length > maxMBCharacters);
  }, [medicalBackgroundText, isMBEditing, doctorData]);

  const handleTextareaChange = (e) => {
    setBioText(e.target.value);
    setEditing(true)
    const newHeight = e.target.scrollHeight + 'px';
    e.target.style.height = newHeight;
  };

  const handleMedicalBackgroundChange = (e) => {
    setMedicalBackgroundText(e.target.value);
    setMBEditing(true)
    const newHeight = e.target.scrollHeight + 'px';
    e.target.style.height = newHeight;
  };

  const updateProfileDetails = async (e) => {
    e.preventDefault();
    // Send a PATCH request to update specific fields of the profile
    console.log(appointmentDuration)
    console.log(serviceCharge)
    try {
      await axios.patch(`${ip}/api/edit-doctor-profile/${doctorData.id}/`, {
        username: userName,
        email: email,
        phone: phone,
        address: address,
        opening_time: openingTime,
        closing_time: closingTime,
        appointment_duration: appointmentDuration,
        service_charge: serviceCharge,
        speciality: speciality,
        bio: bioText.trim(),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json', // Ensure content type is set
        },
      });
      console.log('Profile updated successfully');
      fetchDoctorData()
      swal.fire({
        title: "Profile details updated successfully.",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  const updateMB = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('home_checkup_service', homeCheckupService);
      formData.append('medical_background', medicalBackgroundText);

      // Append medical_license to formData only if it has a value
      if (medicalLicense) {
        formData.append('medical_license', medicalLicense);
      }

      await axios.patch(`${ip}/api/edit-medical-background/${doctorData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Ensure content type is set to multipart/form-data
          },
        }
      );

      console.log('Medical Background updated successfully');
      fetchDoctorData();
      swal.fire({
        title: "Medical Background updated successfully.",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    } catch (error) {
      console.error('Error updating medical background:', error);
    }
  };


  const [viewFullLicense, setViewFullLicense] = useState(false)

  const [licenseDisplay, setLicenseDisplay] = useState()
  const handleLicenceImage = (e) => {
    const file = e.target.files[0];
    setMedicalLicense(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLicenseDisplay(event.target.result);
        console.log(file, event.target.result)
      };

      reader.readAsDataURL(file);
    }
  };



  const [oldPassword, setOldPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [changePWLoading, setChangePWLoading] = useState(false)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (oldPassword && newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        setChangePWLoading(true)
        try {
          const response = await axios.patch(
            `${ip}/api/change-password/`,
            {
              old_password: oldPassword,
              new_password: newPassword
            },
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log(response)
          if (response.status === 200) {
            console.log(response.data.message)
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
          }
          else {
            console.log(response.data.response.data)
          }
          setSuccessMessage(response.data.message);
          setError(null);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('')
        } catch (error) {
          setError(true);
          console.log('catch error', error.response.data)
          swal.fire({
            title: error.response.data.old_password,
            icon: "error",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
        }
        finally {
          setChangePWLoading(false)
        }
      }
      else {
        swal.fire({
          title: "Password Confirmation didn't matched.",
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
    else {
      swal.fire({
        title: "Password field cannot be empty.",
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

  return (
    <>
      {
        doctorData ?
          <>
            <>
              <div className="edit-doctor-profile-section">
                <div className="personal-information">
                  <div className="profile-image-container">
                    <form className="profile-image-div" onSubmit={updateProfilePicture}>
                      <div className="image" style={doctorData ? {
                        backgroundImage: `url(${profilePicture})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      } : null}>
                        <label className="upload-photo-div">
                          <AiOutlineCloudUpload />
                          <p>Upload Photo</p>
                          <input type="file" onChange={(e) => handleImageUpload(e)} />
                        </label>

                        <div className="actions">
                          <IoEyeOutline className="eye-ball" title="Profile View" />
                          <RiFullscreenFill className="full-screen" title="Full Screen" onClick={() => setViewFullImage(!viewFullImage)} />
                        </div>
                      </div>
                    </form>

                    <div className="texts">
                      <h3>Upload Your Profile Picture</h3>
                      {profileImage && (
                        <div className="actions">
                          <button className="save-btn" onClick={updateProfilePicture} type="submit">Save</button>
                          <button className="cancle-btn" type="button" onClick={() => cancleClicked()}>Cancle</button>
                        </div>
                      )}
                      {!profileImage && (
                        <button className="remove-btn">Remove</button>
                      )}
                    </div>
                  </div>
                  {(doctorData && !doctorData.is_verified) ? (
                    <div className="is_not_verified">
                      <p><PiWarningCircleFill /> To get approval please complete your profile. We will mannually accept your approval request. </p>
                    </div>
                  )
                    :
                    <div className="is_verified">
                      <p><FcApproval /> Congratulations! your account is approved. </p>
                    </div>
                  }

                  <div className="doctor-details-container">
                    <h3>Edit Your Personal Information:</h3>
                    <form action="" onSubmit={updateProfileDetails}>
                      <div className="first-name">
                        <label htmlFor="full-name">Full Name</label>
                        <input type="text" id="full-name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                      </div>

                      <div className="email">
                        <label htmlFor="email">Email Address</label>
                        <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>

                      <div className="phone">
                        <label htmlFor="Phone">Phone</label>
                        <input type="number" id="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>

                      <div className="address">
                        <label htmlFor="address">Address</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>

                      <div className="working-hours">
                        <label htmlFor="working-hours">Working Hours</label>
                        <div className="time-field">
                          <input type="time" id="working-hours" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                          <span>To</span>
                          <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                        </div>
                      </div>

                      <div className="speciality">
                        <label htmlFor="speciality">Speciality</label>
                        <input type="text" id="speciality" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
                      </div>

                      <div className="appointment-duration">
                        <label htmlFor="appointment-duration">AVG Appointment Duration (Minutes)</label>
                        <select name="" id="appointment-duration" onChange={(e) => setAppointmentDuration(e.target.value)}>
                          <option value="10" selected={appointmentDuration == 10}>10 Min</option>
                          <option value="20" selected={appointmentDuration == 20}>20 Min</option>
                          <option value="30" selected={appointmentDuration == 30}>30 Min</option>
                          <option value="40" selected={appointmentDuration == 40}>40 Min</option>
                          <option value="50" selected={appointmentDuration == 50}>50 Min</option>
                          <option value="60" selected={appointmentDuration == 60}>60 Min</option>
                        </select>
                      </div>

                      <div className="service-charge">
                        <label htmlFor="service-charge">Service Charge</label>
                        <input type="number" id="service-charge" value={serviceCharge} onChange={(e) => setServiceCharge(e.target.value)} />
                      </div>

                      <div className="bio">
                        <label htmlFor="bio">Bio</label>
                        <textarea
                          ref={textareaRef}
                          value={bioText.replace(/\n/g, '\r\n')} // Handle line breaks directly in the value
                          onChange={handleTextareaChange}
                          rows={1}  // Set a small number of rows initially
                          style={{ resize: 'none', overflowY: 'hidden' }} // Disable textarea resizing and hide overflow
                          className={isEditing && 'editing'}
                          placeholder='Not Set'
                        />
                        {isEditing && (
                          <>
                            <div className={`chars ${(maxCharacters - bioText.length) < 0 ? 'exceed' : null}`}>Characters remaining: {maxCharacters - bioText.length}</div>
                          </>
                        )}
                      </div>

                      <button disabled={disableSave} type='submit' className="update-profile">Update Profile</button>
                    </form>
                  </div>
                </div>

                <div className="other-details-container">
                  <h3>Other Details:</h3>
                  <form action="" onSubmit={updateMB}>

                    <div className="home-checkup">
                      <label htmlFor="home-checkup" className='main-label'>Home Checkup Service <span><LuInfo /></span></label>
                      <div className="checkbox-container">
                        <label>
                          <input type="checkbox" class="toggle-checkbox" id='home-checkup' onChange={(e) => setHomeCheckupService(e.target.checked)} checked={homeCheckupService} />
                          <div class="toggle-switch"></div>
                        </label>
                        <p className={homeCheckupService ? 'active' : ''}>{homeCheckupService ? 'Available' : 'Not Available'}</p>
                      </div>
                    </div>

                    <div className="medical-license">
                      <label htmlFor="medical-license">Medical License</label>
                      <div className="imege-upload">
                        <input type="file" id="medical-license" onChange={handleLicenceImage} />
                        <button type="button" onClick={() => setViewFullLicense(!viewFullLicense)}>View</button>
                      </div>
                    </div>

                    <div className="bio">
                      <label htmlFor="medical-background">Medical Background</label>
                      <textarea
                        ref={medicalBackgroundRef}
                        value={medicalBackgroundText.replace(/\n/g, '\r\n')} // Handle line breaks directly in the value
                        onChange={handleMedicalBackgroundChange}
                        rows={1}  // Set a small number of rows initially
                        style={{ resize: 'none', overflowY: 'hidden' }} // Disable textarea resizing and hide overflow
                        className={isMBEditing && 'editing'}
                        placeholder='Not Set'
                      />
                      {isMBEditing && (
                        <>
                          <div className={`chars ${(maxMBCharacters - medicalBackgroundText.length) < 0 ? 'exceed' : null}`}>Characters remaining: {maxMBCharacters - medicalBackgroundText.length}</div>
                        </>
                      )}
                    </div>

                    <button disabled={disableUpdate} type='submit' className="update-profile">Update</button>
                  </form>
                </div>


                <div className="clinic-location">
                  <h3>Clinic Location:

                  </h3>
                  <div className="map-container">
                    <Map doctor={doctorData} />
                  </div>
                </div>

                <div className="change-passowrd-container">
                  <h3>Change Password:</h3>
                  <form action="" onSubmit={handleChangePassword}>
                    <label htmlFor="old-password" className={error ? 'error' : ''}>Old Password</label>
                    <input type="password" id='old-password' className={error ? 'error' : ''} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

                    <label htmlFor="new-password">New Password</label>
                    <input type="password" id='new-password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <input type="password" id='confirm-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    <button disabled={changePWLoading} type="submit">{changePWLoading ? 'Loading...' : 'Change Password'}</button>
                  </form>
                </div>
              </div>
              {viewFullImage
                ?
                <div className="full-image-div">
                  <RxCross2 onClick={() => setViewFullImage(!viewFullImage)} />
                  <div className="image-container" style={doctorData ? {
                    backgroundImage: `url(${profilePicture})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  } : null}>

                  </div>
                </div>
                :
                null
              }

              {viewFullLicense
                ?
                <div className="full-image-div license-image">
                  <RxCross2 onClick={() => setViewFullLicense(!viewFullLicense)} />
                  <div className="image-container" style={doctorData ? {
                    backgroundImage: `url(${licenseDisplay})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                  } : null}>

                  </div>
                </div>
                :
                null
              }
            </>
          </>
          :
          null
      }
    </>
  )
}

export default EditDoctorProfile