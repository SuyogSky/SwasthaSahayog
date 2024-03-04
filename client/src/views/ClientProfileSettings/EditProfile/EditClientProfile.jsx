import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoEyeOutline } from "react-icons/io5";
import { RiFullscreenFill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { IoMale } from "react-icons/io5";
import { IoFemale } from "react-icons/io5";
import { BsGenderNeuter } from "react-icons/bs";
import './EditClientProfile.scss'
import ip from '../../../ip';
import axios from 'axios';


const swal = require('sweetalert2')
function EditClientProfile({ clientData, fetchClientData }) {
    // const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('currentUser')))
    // const [clientData, setDoctorData] = useState(true)
    // const fetchClientData = async () => {
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
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];


    useEffect(() => {
        if (clientData) {
            // fetchClientData()
            setProfilePicture(clientData.image)
            setUserName(clientData.username)
            setEmail(clientData.email)
            setPhone(clientData.phone)
            setAddress(clientData.address)
            setDateOfBirth(clientData.date_of_birth)
            setBloodGroup(clientData.blood_group)
            setGender(clientData.gender)
            setBioText(clientData.bio || 'NotSet')
        }
        console.log('Client: ', clientData)
    }, [clientData])


    // <----------To Update Profile Picture--------->
    const [profilePicture, setProfilePicture] = useState();
    const [profileImage, setProfileImage] = useState()
    const [viewFullImage, setViewFullImage] = useState(false)

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        console.log('file is uploaded')
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePicture(event.target.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const cancleClicked = () => {
        setProfilePicture(clientData.image || '')
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
                    await axios.patch(`${ip}/api/update-picture/${clientData.id}/`, formData, {
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
                    fetchClientData()
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
    const [userName, setUserName] = useState(clientData.username)
    const [email, setEmail] = useState(clientData.email)
    const [phone, setPhone] = useState(clientData.phone)
    const [address, setAddress] = useState(clientData.address)
    const [dateOfBirth, setDateOfBirth] = useState(clientData.date_of_birth)
    const [bloodGroup, setBloodGroup] = useState(clientData.blood_group)
    const [gender, setGender] = useState(clientData.gender)
    const [bioText, setBioText] = useState(clientData?.bio || 'Not Set'); // Initialize with an empty string if clientData or bio is undefined


    const textareaRef = useRef(null);
    const maxCharacters = 200;
    const [isEditing, setEditing] = useState(false);

    const [disableSave, setDisableSave] = useState(false);
    useEffect(() => {
        if (textareaRef.current) {
            const newHeight = textareaRef.current.scrollHeight + 'px';
            textareaRef.current.style.height = newHeight;
        }
        setDisableSave(bioText.length > maxCharacters);
    }, [bioText, isEditing, clientData]);

    const handleTextareaChange = (e) => {
        setBioText(e.target.value);
        setEditing(true)
        const newHeight = e.target.scrollHeight + 'px';
        e.target.style.height = newHeight;
    };

    const updateProfileDetails = async (e) => {
        e.preventDefault();
        console.log(userName, email, phone, address, dateOfBirth, bloodGroup, gender, bioText)
        // Send a PATCH request to update specific fields of the profile
        try {
            await axios.patch(`${ip}/api/edit-client-profile/${clientData.id}/`, {
                username: userName,
                email: email,
                phone: phone,
                address: address,
                gender: gender,
                date_of_birth: dateOfBirth,
                blood_group: bloodGroup,
                bio: bioText.trim(),
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json', // Ensure content type is set
                },
            });
            console.log('Profile updated successfully');
            fetchClientData()
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

    return (
        <>
            {
                clientData ?
                    <>
                        <>
                            <div className="edit-client-profile-section">
                                <div className="personal-information">
                                    <h3>Edit Your Personal Information:</h3>
                                    <div className="profile-image-container">
                                        <form className="profile-image-div" onSubmit={updateProfilePicture}>
                                            <div className="image" style={clientData ? {
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

                                    <div className="client-details-container">
                                        <form action="" onSubmit={updateProfileDetails}>
                                            <div className="full-name">
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


                                            <div className="dob">
                                                <label htmlFor="dob">Date Of Birth</label>
                                                <input type="date" id="dob" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                                            </div>

                                            <div className="blood-group">
                                                <label htmlFor="blood-group">Blood Group</label>
                                                <select id="blood-group" name="blood-group" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                                                    {bloodGroups.map((group) => (
                                                        <option key={group} value={group}>
                                                            {group}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="gender">
                                                <label htmlFor="gender">Gender</label>
                                                <div class="radio-inputs">
                                                    <label>
                                                        <input class="radio-input male" type="radio" name="gender" value='Male' onChange={(e) => setGender(e.target.value)} checked={gender == 'Male'} />
                                                        <span class="radio-tile male">
                                                            <span class="radio-icon">
                                                                <IoMale />
                                                            </span>
                                                            <span class="radio-label">Male</span>
                                                        </span>
                                                    </label>
                                                    <label>
                                                        <input class="radio-input female" type="radio" name="gender" value='Female' onChange={(e) => setGender(e.target.value)} checked={gender == 'Female'} />
                                                        <span class="radio-tile female">
                                                            <span class="radio-icon">
                                                                <IoFemale />
                                                            </span>
                                                            <span class="radio-label">Female</span>
                                                        </span>
                                                    </label>
                                                    <label>
                                                        <input class="radio-input other" type="radio" name="gender" value='Other' onChange={(e) => setGender(e.target.value)} checked={gender == 'Other'} />
                                                        <span class="radio-tile other">
                                                            <span class="radio-icon">
                                                                <BsGenderNeuter />
                                                            </span>
                                                            <span class="radio-label">Other</span>
                                                        </span>
                                                    </label>
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

                                <div className="change-passowrd-container">
                                    <h3>Change Password:</h3>
                                    <form action="">
                                        <label htmlFor="old-password">Old Password</label>
                                        <input type="password" id='old-password' />

                                        <label htmlFor="new-password">New Password</label>
                                        <input type="password" id='new-password' />

                                        <label htmlFor="confirm-password">Confirm New Password</label>
                                        <input type="password" id='confirm-password' />

                                        <button type="submit">Change Password</button>
                                    </form>
                                </div>
                            </div>
                            {viewFullImage
                                ?
                                <div className="full-image-div">
                                    <RxCross2 onClick={() => setViewFullImage(!viewFullImage)} />
                                    <div className="image-container" style={clientData ? {
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
                        </>
                    </>
                    :
                    null
            }
        </>
    )
}

export default EditClientProfile