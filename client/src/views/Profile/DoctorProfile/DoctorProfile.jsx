import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import './DoctorProfile.scss'

import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import ip from "../../../ip";
import { FiFilter } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { CiSaveUp2 } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineCloudUpload } from "react-icons/ai";
import AuthContext from "../../../context/AuthContext";
import { BsExclamationCircleFill } from "react-icons/bs";
import { IoEyeOutline } from "react-icons/io5";
import { RiFullscreenFill } from "react-icons/ri";
import Loading from "../../Loading/Loading";
import useAxios from "../../../utils/useAxios";
import TimeSlot from "./BookAppointment/TimeSlot/TimeSlot";
import AddPostForm from "../UserPosts/AddPostForm/AddPostForm";
import Reviews from "./Reviews/Reviews";
import BookAppointment from "./BookAppointment/BookAppointment";
import ClinicLocation from "./ClinicLocation/ClinicLocation";
import UserPosts from "../UserPosts/Posts";

const swal = require('sweetalert2')
const DoctorProfile = ({ id }) => {
    const axios = useAxios()
    const currentUser = JSON.parse(localStorage.getItem(''))

    let { user } = useContext(AuthContext)
    const [isCurrentUser, setIsCurrentUser] = useState()

    const [loading, setLoading] = useState(false)
    // Fetch client details from the backend API using the client ID
    const fetchDoctorData = () => {
        axios.get(`${ip}/api/doctor-profile/${id}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                const data = response.data;
                setDoctorData(data);
                setBioText(data.bio || 'Not Set');
                setProfilePicture(data.image || null);
                console.log("This is profiles data: ", data);
                console.log("This is current user data: ", user);
                console.log('is same: ', user);
                setIsCurrentUser(user.email === data.email);
                setFormUserName(data.username);
                setFormPhone(data.phone);
                setFormAddress(data.address);
                setFormDOB(data.date_of_birth);
            })
            .catch(error => console.error('Error fetching client details:', error));
    };
    const [doctorData, setDoctorData] = useState(null);
    useEffect(() => {
        fetchDoctorData()
    }, [id]);






    // Edit Bio
    const [isEditing, setEditing] = useState(false);
    const [bioText, setBioText] = useState(''); // Initial bio text
    const handleEditClick = () => {
        setEditing(true);
    };


    const [saveBtnLoading, setSaveButtonLoading] = useState(false)
    const handleSaveClick = () => {
        setEditing(false);
        setSaveButtonLoading(true)
        axios.patch(`${ip}/api/update-bio/${id}/`, { bio: bioText.trim() }, {
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if needed
            },
        })
            .then(response => {
                console.log('Bio updated successfully:', response.data)
                setSaveButtonLoading(false)
                fetchDoctorData()
            })
            .catch(error => {
                console.error('Error updating bio:', error)
                fetchDoctorData()
            });

    };

    const handleCancelClick = () => {
        setEditing(false);
        setBioText(doctorData.bio)
    };
    const textareaRef = useRef(null);
    const maxCharacters = 200;
    const [disableSave, setDisableSave] = useState(false);
    useEffect(() => {
        if (textareaRef.current) {
            const newHeight = textareaRef.current.scrollHeight + 'px';
            textareaRef.current.style.height = newHeight;
        }
        setDisableSave(bioText.length > maxCharacters);
    }, [bioText, isEditing, doctorData]);

    const handleTextareaChange = (e) => {
        setBioText(e.target.value);
        const newHeight = e.target.scrollHeight + 'px';
        e.target.style.height = newHeight;
    };



    const [posts, setPosts] = useState([]);
    const fetchUserPosts = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${ip}/forum/user-posts/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.status === 200) {
                const data = response.data;
                setPosts(data);
                setLoading(false);
                console.log("The posts are: ", data);
            } else {
                throw new Error(`Failed to fetch posts: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Handle error state as needed
        }
    };
    useEffect(() => {
        fetchUserPosts();
    }, [id]); // Include id in the dependency array to re-run the effect when id changes


    const [showFullText, setShowFullText] = useState(false);

    const [disable, setDisable] = useState(false)

    const [viewPostForm, setViewPostForm] = useState(false)
    const [value, setValue] = useState('');

    const handlePostTextareaChange = (e) => {
        console.log(e.target.value)
        setValue(e.target.value);
        adjustTextareaHeight(e.target);
    };

    const adjustTextareaHeight = (textarea) => {
        const maxHeight = 300;
        textarea.style.height = 'auto'; // Reset height to auto to calculate the new height
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'; // Set the new height, max maxHeightpx
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
        }
    };

    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState('')

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file)
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleAddPost = async (e) => {
        e.preventDefault();
        console.log(value, image);
        console.log(localStorage.getItem('token'));

        // Prepare the data to be sent to the server
        const postData = new FormData();
        postData.append('content', value);
        postData.append('image', image);

        try {
            const response = await axios.post(`${ip}/forum/posts/`, postData, {
                headers: {
                    // 'Content-Type': 'application/json',  // Remove this line when using FormData
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.status === 201) {
                const responseData = response.data;
                console.log('Post added successfully:', responseData);
                swal.fire({
                    title: "Post Uploaded Successfully.",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
                setValue('');
                setImage('');
                setImagePreview('');
                fetchUserPosts();
                setViewPostForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                console.error('Error adding post:', response.statusText);
                swal.fire({
                    // title: "Please add some content description.",
                    title: response.status,
                    icon: "warning",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`${ip}/forum/post/${postId}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("token")}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 200) {
                        console.log('Post deleted successfully');
                        swal.fire({
                            title: "Deleted!",
                            text: "Your post has been deleted.",
                            icon: "success",
                        });
                        fetchUserPosts();
                        // Optionally, you can perform additional actions after successful deletion
                    } else {
                        console.error('Error deleting post:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error deleting post:', error);
                }
            }
        });
    };

    // const [formData, setFormData] = useState({
    //     username: '',
    //     phone: '',
    //     address: '',
    //     date_of_birth: null,
    // });



    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        address: '',
        date_of_birth: null,
    });

    const [formUserName, setFormUserName] = useState();
    const [formPhone, setFormPhone] = useState()
    const [formAddress, setFormAddress] = useState()
    const [formDOB, setFormDOB] = useState()

    const UpdateProfileDetails = async (e) => {
        e.preventDefault();
        console.log(formData)
        // Send a PATCH request to update specific fields of the profile
        try {
            await axios.patch(`${ip}/api/edit-profile/${id}/`, {
                username: formUserName,
                phone: formPhone,
                address: formAddress,
                date_of_birth: formDOB
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

    const [profilePicture, setProfilePicture] = useState();
    const [profileImage, setProfileImage] = useState();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setProfileImage(e.target.files[0]);
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                setProfilePicture(event.target.result);
            };

            reader.readAsDataURL(file);
        }
    };

    // profile picture change
    const updateProfilePicture = async (e) => {
        e.preventDefault()
        swal.fire({
            title: "Are You Sure?",
            text: "Do you want to update your profile picture?",
            icon: "warning",
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
                    await axios.patch(`${ip}/api/update-picture/${id}/`, formData, {
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
                }

            }
        });
    };
    const cancleClicked = () => {
        setProfilePicture(doctorData.image)
        setProfileImage()
    }

    const [isUpdatable, setIsUpdatable] = useState(false)

    const [viewFullImage, setViewFullImage] = useState(false)


    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
        return formattedDate;
    }

    const [activeContent, setActiveContent] = useState('overview')

    return (
        <>
            {loading ?
                <Loading />
                :
                <section className="doctor-profile-section" style={viewFullImage || viewPostForm ? {
                    overflow: 'hidden',
                    height: 'calc(100vh - 120px)'
                } : null}>
                    {doctorData && (
                        <>
                            <div className="doctor-info">
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
                                    {profileImage && (
                                        <div className="actions">
                                            <button className="save-btn" type="submit">Save</button>
                                            <button className="cancle-btn" type="button" onClick={() => cancleClicked()}>Cancle</button>
                                        </div>
                                    )}
                                </form>
                                <div className="details">
                                    <span className="date-joined"><span>Date Joined:</span> {formatDate(new Date(doctorData.date_joined).toLocaleDateString())}</span>
                                    <h4>{doctorData.username}</h4>
                                    <p><span>Email: </span>{doctorData.email}</p>
                                    <p><span>Phone: </span>{doctorData.phone}</p>
                                    <p><span>Address: </span>{doctorData.address}</p>
                                    {isCurrentUser ? <button onClick={() => setViewPostForm(!viewPostForm)}>Upload Post</button> : <button>Chat</button>}
                                </div>
                            </div>

                            <div className="main-container">
                                <div className="tab-bar">
                                    <ul>
                                        <li onClick={() => setActiveContent('overview')} className={`overview ${activeContent === 'overview' ? 'active' : ''}`}>Overview</li>
                                        <li onClick={() => setActiveContent('posts')} className={`posts ${activeContent === 'posts' ? 'active' : ''}`}>Posts</li>
                                        <li onClick={() => setActiveContent('clinic-location')} className={`clinic-location ${activeContent === 'clinic-location' ? 'active' : ''}`}>Clinic&nbsp;Location</li>
                                        <li onClick={() => setActiveContent('book-appointment')} className={`book-appointment ${activeContent === 'book-appointment' ? 'active' : ''}`}>Book&nbsp;Appointment</li>
                                        <li onClick={() => setActiveContent('reviews')} className={`reviews ${activeContent === 'reviews' ? 'active' : ''}`}>Reviews</li>
                                    </ul>
                                </div>


                                <div className="doctor-profile-contents">

                                    {/* ========== OVERVIEW ========== */}
                                    <div className={`content overview ${activeContent === 'overview' ? 'active' : ''}`}>
                                        <h4>Biography of {doctorData.username}</h4>
                                        {doctorData.speciality && <span>Field: {doctorData.speciality}</span>}
                                        <pre>{doctorData.bio}</pre>

                                        <h4>Medical Background</h4>
                                        <pre>{doctorData.medical_background}</pre>
                                    </div>

                                    {/* ========== CLINIC LOCATION ========== */}
                                    <div className={`content posts ${activeContent === 'posts' ? 'active' : ''}`}>
                                        <UserPosts posts={posts} user_id={id} fetchUserPosts={fetchUserPosts}/>
                                    </div>

                                    {/* ========== CLINIC LOCATION ========== */}
                                    <div className={`content clinic-location ${activeContent === 'clinic-location' ? 'active' : ''}`}>
                                        <ClinicLocation doctor={doctorData} />
                                    </div>

                                    {/* ========== BOOK APPOINTMENT ========== */}
                                    <div className={`content book-appointment ${activeContent === 'book-appointment' ? 'active' : ''}`}>
                                        {/* <div className="left">
                                            <div className="client-information information">
                                                <h4>Client Information</h4>
                                                <div className="info">
                                                    <div className="image" style={ ? {
                                                        backgroundImage: `url(${.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                    } : null}>

                                                    </div>
                                                    <div className="details">
                                                        <p>{.username}</p>
                                                        <span>{new Date().toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="doctor-details information">
                                                <h4>Doctor Information</h4>
                                                <div className="info">
                                                    <div className="image" style={doctorData ? {
                                                        backgroundImage: `url(${doctorData.image})`,
                                                        backgroundPosition: 'center',
                                                        backgroundSize: 'cover',
                                                        backgroundRepeat: 'no-repeat',
                                                    } : null}>

                                                    </div>
                                                    <div className="details">
                                                        <p>{doctorData.username}</p>
                                                        <span>{doctorData.speciality}</span>
                                                    </div>
                                                </div>

                                                <p className="working-hours"><span>Available from: </span>{doctorData.opening_time} - {doctorData.closing_time}</p>
                                            </div>
                                        </div>

                                        <div className="appointment-form-container">
                                            <h6>Book Appointment Form</h6>
                                            <form action="" onSubmit={bookAppointment}>
                                                <DateSelector onSelectDate={handleDateSelection} />

                                                <TimeSlot onSelectTime={handleTimeSelection} selectedDate={appointmentDate} />
                                                <div className="comment">
                                                    <label htmlFor="comment">Comment</label>
                                                    <textarea name="comment" id="comment" onChange={(e) => setAppointmentComment(e.target.value)} value={appointmentComment}></textarea>
                                                </div>

                                                <button type="submit">Book</button>
                                            </form>
                                        </div> */}
                                        <BookAppointment doctorData={doctorData} />
                                    </div>

                                    <div className={`content reviews ${activeContent === 'reviews' ? 'active' : ''}`}>
                                        <Reviews doctor_id={id} />
                                    </div>

                                </div>
                            </div>




                            {viewPostForm && (
                                <AddPostForm viewPostForm={viewPostForm} setViewPostForm={setViewPostForm} fetchPosts={fetchUserPosts} />
                            )}
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


                        </>
                        // <>
                        //     <div className="left">

                        //         <div className="bio">
                        //             <h4 className="top">{isCurrentUser ? <>Bio <BiEdit className="edit" onClick={handleEditClick} /></> : <>Biography of Dr. Suyog Shakye</>}</h4>
                        //             <div className="bio-container">
                        //                 <textarea
                        //                     ref={textareaRef}
                        //                     value={bioText.replace(/\n/g, '\r\n')} // Handle line breaks directly in the value
                        //                     onChange={handleTextareaChange}
                        //                     readOnly={!isEditing}
                        //                     rows={1}  // Set a small number of rows initially
                        //                     style={{ resize: 'none', overflowY: 'hidden' }} // Disable textarea resizing and hide overflow
                        //                     className={isEditing && 'editing'}
                        //                 />
                        //                 {isEditing && (
                        //                     <>
                        //                         <div>Characters remaining: {maxCharacters - bioText.length}</div>
                        //                         <div className="actions">
                        //                             <button disabled={disableSave} onClick={!disable && handleSaveClick}>Save</button>
                        //                             <button onClick={handleCancelClick}>Cancel</button>
                        //                         </div>
                        //                     </>
                        //                 )}
                        //                 {saveBtnLoading && (
                        //                     <div className="loading">
                        //                         <div class="ld-ripple">
                        //                             <div></div>
                        //                             <div></div>
                        //                         </div>
                        //                     </div>
                        //                 )}
                        //             </div>

                        //         </div>

                        //         <div className="posts">
                        //             {posts.length > 0
                        //                 ?
                        //                 <>
                        //                     <div className="filter-div">
                        //                         <h3>Posts</h3>
                        //                         <button className="filter"><FiFilter /><p>Filter</p></button>
                        //                     </div>

                        //                     <div className="contents">
                        //                         {posts && posts.map((post) => (
                        //                             <div className="content">
                        //                                 <div className="top">
                        //                                     <div className="doctor-details">
                        //                                         <div className="image" style={post ? {
                        //                                             backgroundImage: `url(${ip}/${post.user.image})`,
                        //                                             backgroundPosition: 'center',
                        //                                             backgroundSize: 'cover',
                        //                                             backgroundRepeat: 'no-repeat',
                        //                                         } : null}>

                        //                                         </div>
                        //                                         <p>
                        //                                             <span className="name">{post.user.username}</span>
                        //                                             <span className="date">{new Date(post.date).toLocaleDateString()}</span>
                        //                                         </p>
                        //                                     </div>

                        //                                     <div className="actions">
                        //                                         <FaEdit title="Edit Post" />
                        //                                         <MdDelete title="Delete Post" onClick={() => handleDeletePost(post.id)} />
                        //                                     </div>
                        //                                 </div>
                        //                                 <div className="post-container">
                        //                                     {/* <p className="details">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste a laborum reiciendis consequatur, tenetur deleniti at asperiores qui nulla ullam?Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum modi iure sint, eveniet id eum asperiores quis aspernatur amet consectetur nemo minima quidem maxime soluta facilis officia ad possimus repellendus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint ea nulla a hic totam dolor consequatur incidunt dolorem nesciunt voluptates?</p> */}
                        //                                     {/* <p className={`details ${showFullText ? "show-all" : "limited"}`}>
                        //                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste a laborum reiciendis consequatur, tenetur deleniti at asperiores qui nulla ullam?Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum modi iure sint, eveniet id eum asperiores quis aspernatur amet consectetur nemo minima quidem maxime soluta facilis officia ad possimus repellendus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint ea nulla a hic totam dolor consequatur incidunt dolorem nesciunt voluptates?
                        //                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste a laborum reiciendis consequatur, tenetur deleniti at asperiores qui nulla ullam?Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum modi iure sint, eveniet id eum asperiores quis aspernatur amet consectetur nemo minima quidem maxime soluta facilis officia ad possimus repellendus. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint ea nulla a hic totam dolor consequatur incidunt dolorem nesciunt voluptates?
                        //                     </p> */}
                        //                                     {/* <p className={`details ${showFullText ? "show-all" : "limited"}`}>
                        //                         </button>
                        //                     )} */}
                        //                                     <p className={`details ${showFullText ? "show-all" : "limited"}`}>
                        //                                                 onClick={() => setShowFullText(!showFullText)}
                        //                                             >
                        //                                                 {showFullText ? "See Less" : "See More"}
                        //                                             </button>
                        //                                         )}
                        //                                     </p>
                        //                                     {post.image && (
                        //                                         <div className="post-image" style={post ? {
                        //                                             backgroundImage: `url(${ip}/${post.image})`,
                        //                                             backgroundPosition: 'center',
                        //                                             backgroundSize: 'cover',
                        //                                             backgroundRepeat: 'no-repeat',
                        //                                         } : null}>

                        //                                         </div>
                        //                                     )}
                        //                                     <div className="comment">
                        //                                         <span><FaRegComment /><p>Comments</p></span>
                        //                                     </div>
                        //                                 </div>
                        //                             </div>
                        //                         ))}
                        //                     </div>
                        //                 </>
                        //                 :
                        //                 <h6>No Posts Available</h6>
                        //             }
                        //         </div>


                        //     </div>

                        //     {/* <div className="right">
                        //         <form action="" onSubmit={UpdateProfileDetails}>
                        //             <h4>Edit Profile</h4>

                        //             <div className="username">
                        //                 <label htmlFor="username">User Name:</label>
                        //                 <input type="text" id="username" value={formUserName} onChange={(e) => {
                        //                     setIsUpdatable(true)
                        //                     setFormUserName(e.target.value)
                        //                 }} />
                        //             </div>

                        //             <div className="phone">
                        //                 <label htmlFor="phone">Phone:</label>
                        //                 <input type="number" id="phone" value={formPhone} onChange={(e) => {
                        //                     setIsUpdatable(true)
                        //                     setFormPhone(e.target.value)
                        //                 }} />
                        //             </div>

                        //             <div className="address">
                        //                 <label htmlFor="address">Address:</label>
                        //                 <input type="text" id="address" value={formAddress} onChange={(e) => {
                        //                     setIsUpdatable(true)
                        //                     setFormAddress(e.target.value)
                        //                 }} />
                        //             </div>

                        //             <button disabled={!isUpdatable} type="submit" className={!isUpdatable ? 'disabled' : ''}>Update</button>
                        //         </form>

                        //         <div className="appointment-history">
                        //             <h4>Appointment History</h4>

                        //             <div className="history-container">
                        //                 <div className="history">
                        //                     <div className="appointment-details">
                        //                         <p>Dr. Doctor 1</p>
                        //                         <span>28/11/2023 - 12:30 PM</span>
                        //                     </div>
                        //                     <button className="action"><BsExclamationCircleFill /></button>
                        //                 </div>

                        //                 <div className="history">
                        //                     <div className="appointment-details">
                        //                         <p>Dr. Doctor 1</p>
                        //                         <span>28/11/2023 - 12:30 PM</span>
                        //                     </div>
                        //                     <button className="action"><BsExclamationCircleFill /></button>
                        //                 </div>

                        //                 <div className="history">
                        //                     <div className="appointment-details">
                        //                         <p>Dr. Doctor 1</p>
                        //                         <span>28/11/2023 - 12:30 PM</span>
                        //                     </div>
                        //                     <button className="action"><BsExclamationCircleFill /></button>
                        //                 </div>
                        //             </div>
                        //         </div>
                        //     </div> */}
                        // </>
                    )}
                </section>
            }
        </>
    )
}


export default DoctorProfile