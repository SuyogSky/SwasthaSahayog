import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { RiFullscreenFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { PiWarningCircleFill } from "react-icons/pi";
import { FcApproval } from "react-icons/fc";
import './EditPharmacistProfile.scss'
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
import { LuInfo } from "react-icons/lu";
import Map from './Location/Map';
const swal = require('sweetalert2')
function EditPharmacistProfile({ pharmacistData, fetchPharmacistData }) {

  const axios = useAxios()
  // const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
  // const [pharmacistData, setDoctorData] = useState(true)
  // const fetchPharmacistData = async () => {
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
    if (pharmacistData) {
      // fetchPharmacistData()
      setProfilePicture(pharmacistData.image)
      setLicenseDisplay(pharmacistData.pharmacy_license)
      setUserName(pharmacistData.username)
      setEmail(pharmacistData.email)
      setPhone(pharmacistData.phone)
      setAddress(pharmacistData.address)
      setOpeningTime(pharmacistData.opening_time)
      setClosingTime(pharmacistData.closing_time)
      setSpeciality(pharmacistData.speciality)
      setBioText(pharmacistData.bio || '')
      setMedicalBackgroundText(pharmacistData.medical_background || '')
      setAppointmentDuration(pharmacistData.appointment_duration)
      setServiceCharge(pharmacistData.service_charge)
      setHomeDeliveryService(pharmacistData.delivery_service)
    }
  }, [pharmacistData])


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
    setProfilePicture(pharmacistData.image)
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
          await axios.patch(`${ip}/api/update-picture/${pharmacistData.id}/`, formData, {
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
          fetchPharmacistData()
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
  const [userName, setUserName] = useState(pharmacistData.username)
  const [email, setEmail] = useState(pharmacistData.email)
  const [phone, setPhone] = useState(pharmacistData.phone)
  const [address, setAddress] = useState(pharmacistData.address)
  const [openingTime, setOpeningTime] = useState(pharmacistData.opening_time)
  const [closingTime, setClosingTime] = useState(pharmacistData.closing_time)
  const [speciality, setSpeciality] = useState(pharmacistData.speciality)
  const [bioText, setBioText] = useState(pharmacistData?.bio || ''); // Initialize with an empty string if pharmacistData or bio is undefined
  const [medicalBackgroundText, setMedicalBackgroundText] = useState(pharmacistData?.medical_background || ''); // Initialize with an empty string if pharmacistData or bio is undefined
  const [homeDeliveryService, setHomeDeliveryService] = useState(pharmacistData?.delivery_service)
  const [pharmacyLicense, setPharmacyLicense] = useState()

  const [appointmentDuration, setAppointmentDuration] = useState(pharmacistData?.appointment_duration)
  const [serviceCharge, setServiceCharge] = useState(pharmacistData?.service_charge)


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
  }, [medicalBackgroundText, isMBEditing, pharmacistData]);

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
      await axios.patch(`${ip}/api/edit-pharmacist-profile/${pharmacistData.id}/`, {
        username: userName,
        email: email,
        phone: phone,
        address: address,
        opening_time: openingTime,
        closing_time: closingTime,
        bio: bioText.trim(),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json', // Ensure content type is set
        },
      });
      console.log('Profile updated successfully');
      fetchPharmacistData()
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

  const updateOthersDetails = async (e) => {
    e.preventDefault();
    console.log(pharmacyLicense)
    try {
      const formData = new FormData();
      formData.append('delivery_service', homeDeliveryService);

      // Append pharmacy_license to formData only if it has a value
      if (pharmacyLicense) {
        formData.append('pharmacy_license', pharmacyLicense);
      }

      await axios.patch(`${ip}/api/edit-others-details/${pharmacistData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Ensure content type is set to multipart/form-data
          },
        }
      );

      console.log('Medical Background updated successfully');
      fetchPharmacistData();
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
    setPharmacyLicense(file);
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
        pharmacistData ?
          <>
            <>
              <div className="edit-doctor-profile-section">
                <div className="personal-information">
                  <div className="profile-image-container">
                    <form className="profile-image-div" onSubmit={updateProfilePicture}>
                      <div className="image" style={pharmacistData ? {
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
                  {(pharmacistData && !pharmacistData.is_verified) ? (
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
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly />
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
                        <label htmlFor="working-hours">Opening Hours</label>
                        <div className="time-field">
                          <input type="time" id="working-hours" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                          <span>To</span>
                          <input type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                        </div>
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
                  <form action="" onSubmit={updateOthersDetails}>

                    <div className="home-checkup">
                      <label htmlFor="home-checkup" className='main-label'>Home Delivery Service <span><LuInfo /></span></label>
                      <div className="checkbox-container">
                        <label>
                          <input type="checkbox" class="toggle-checkbox" id='home-checkup' onChange={(e) => setHomeDeliveryService(e.target.checked)} checked={homeDeliveryService} />
                          <div class="toggle-switch"></div>
                        </label>
                        <p className={homeDeliveryService ? 'active' : ''}>{homeDeliveryService ? 'Available' : 'Not Available'}</p>
                      </div>
                    </div>

                    <div className="medical-license">
                      <label htmlFor="medical-license">Pharmacy License</label>
                      <div className="imege-upload">
                        <input type="file" id="medical-license" onChange={handleLicenceImage} />
                        <button type="button" onClick={() => setViewFullLicense(!viewFullLicense)}>View</button>
                      </div>
                    </div>

                    {/* <div className="bio">
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
                    </div> */}

                    <button disabled={disableUpdate} type='submit' className="update-profile">Update</button>
                  </form>
                </div>


                <div className="clinic-location">
                  <h3>Clinic Location:

                  </h3>
                  <div className="map-container">
                    <Map pharmacist={pharmacistData} fetchPharmacistData={fetchPharmacistData} />
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
                  <div className="image-container" style={pharmacistData ? {
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
                  <div className="image-container" style={pharmacistData ? {
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

export default EditPharmacistProfile