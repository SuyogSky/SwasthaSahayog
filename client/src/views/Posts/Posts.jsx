import React, { useEffect, useState } from 'react'
import ViewPosts from './ViewPosts/ViewPosts'
import './Posts.scss'
import useAxios from '../../utils/useAxios'
import ip from '../../ip'
function Posts() {
  const axios = useAxios()

  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(false)
  const fetchPosts = async () => {
    const accessToken = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')).access : null;
    if (accessToken) {
      try {
        const response = await axios.get(`${ip}/forum/posts/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) { // Assuming 200 is the status for a successful request
          const data = response.data;
          setPosts(data);
          setLoading(false);
          console.log("The posts are: ", data);
        } else {
          console.error('Error fetching posts:', response.statusText);
          // Handle error state as needed
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle error state as needed
      }
    } else {
      console.error('Access token not found in local storage.');
    }
  };

  useEffect(() => {
    // Call the fetchPosts function
    fetchPosts();
  }, []);
  return (
    <section className="posts-main-container">
      <ViewPosts posts={posts} fetchPosts={fetchPosts}/>
    </section>
  )
}

export default Posts