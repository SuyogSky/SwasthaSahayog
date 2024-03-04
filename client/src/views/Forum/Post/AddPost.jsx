import React, { useState } from 'react';
import Posts from './Posts';
import ip from '../../../ip';

const AddPost = ({ onAddPost }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleAddPost = async () => {
    console.log(localStorage.getItem('token'))
    // Prepare the data to be sent to the server
    const postData = new FormData();
    postData.append('content', content);
    postData.append('image', image);  // Assuming 'image' is a File object



    try {
      const response = await fetch(`${ip}/forum/posts/`, {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',  // Remove this line when using FormData
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: postData,
      });

      if (response.ok) {
        const responseData = await response.json();
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
      <div>
        <h2>Add Post</h2>
        <label htmlFor="content">Content:</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />

        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} />

        <button onClick={handleAddPost}>Add Post</button>
      </div>
      <Posts />
    </>
  );
};

export default AddPost;
