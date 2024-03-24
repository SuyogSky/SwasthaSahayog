import React, { useState } from 'react';
import Posts from './Posts';
import ip from '../../../ip';
import useAxios from '../../../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './AddPost.scss'
import AddPostForm from '../../Posts/AddPostForm/AddPostForm';
const AddPost = ({ onAddPost }) => {
  const history = useHistory();
  const axios = useAxios()

  const accessToken = localStorage.getItem('token')
  const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))


  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const handleAddPost = async () => {
    console.log(localStorage.getItem('token'));

    // Prepare the data to be sent to the server
    const postData = new FormData();
    postData.append('content', content);
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
      } else {
        console.error('Error adding post:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <>
    <AddPostForm />
      <form className="add-post">
        <div className="top">
          <div className="image" style={currentUser ? {
            backgroundImage: `url(${currentUser.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          } : null} onClick={() => history.push(`/profile/${currentUser.id}`)}>

          </div>

          

        </div>

      </form>
      {/* <div>
        <h2>Add Post</h2>
        <label htmlFor="content">Content:</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />

        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} />

        <button onClick={handleAddPost}>Add Post</button>
      </div> */}
      {/* <Posts /> */}
    </>
  );
};

export default AddPost;