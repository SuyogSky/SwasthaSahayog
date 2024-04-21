import React, { useState } from 'react'
import useAxios from '../../../utils/useAxios';
import ip from '../../../ip';
import { RxCross2 } from "react-icons/rx";
import { AiOutlineCloudUpload } from "react-icons/ai";
import './AddPostForm.scss'
const swal = require('sweetalert2')
function AddPostForm({ viewPostForm, setViewPostForm, fetchPosts }) {
    const axios = useAxios()

    const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))


    const [value, setValue] = useState('');
    const adjustTextareaHeight = (textarea) => {
        const maxHeight = 300;
        textarea.style.height = 'auto'; // Reset height to auto to calculate the new height
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'; // Set the new height, max maxHeightpx
        if (textarea.scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
        }
    };

    const handlePostTextareaChange = (e) => {
        console.log(e.target.value)
        setValue(e.target.value);
        adjustTextareaHeight(e.target);
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
                setValue('');
                setImage('');
                setImagePreview('');
                fetchPosts();
                setViewPostForm(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
    return (
        <div className="upload-post-form">
            <form action="" onSubmit={handleAddPost}>
                <div className="top">
                    <h6>Create Post</h6>
                    <RxCross2 onClick={() => setViewPostForm(!viewPostForm)} />
                </div>
                <div className="user-detail">
                    <div className="image" style={currentUser ? {
                        backgroundImage: `url(${currentUser.image})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    } : null}>

                    </div>
                    <p>
                        <span className="name">{currentUser.username}</span>
                        <span className="date">{new Date().toLocaleDateString()}</span>
                    </p>
                </div>

                <div className="post-content-fields">
                    <textarea
                        value={value}
                        onChange={handlePostTextareaChange}
                        placeholder="Write Your Problem..."
                    />

                    <div className="image-upload">
                        <label htmlFor="post-image" className="image-field">
                            <input type="file" id="post-image" onChange={handleFileChange} />
                            {
                                imagePreview ?
                                    <img src={imagePreview} alt="" srcset="" />
                                    :
                                    <>
                                        <AiOutlineCloudUpload />
                                        <p>Upload Image</p>
                                    </>
                            }
                        </label>
                    </div>
                </div>

                <div className="btn-container">
                    <button type="submit" className="upload-btn">Post</button>
                </div>
            </form>
        </div>
    )
}

export default AddPostForm