import React, { useState, useEffect } from 'react';

import './Posts.scss'
import ip from '../../../ip';
import { FiFilter } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { useHistory } from 'react-router-dom'
import useAxios from '../../../utils/useAxios';
import AddPost from './AddPost'

// const truncateWords = (text, numWords) => {
//   const words = text.split(' ');
//   return words.slice(0, numWords).join(' ') + (words.length > numWords ? ' ...' : '');
// };

const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  if (numWords >= words.length) {
    return text;
  }
  return words.slice(0, numWords).join(' ') + ' ...';
};


const Posts = () => {
  const history = useHistory()
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState([])
  const axios = useAxios()
  useEffect(() => {
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
            console.log('Posts:', data);
            setPosts(data);
          } else {
            console.error('Error fetching posts:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching posts2:', error);
        }

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

    // Call the fetchPosts function
    fetchPosts();
  }, []);
  // Empty dependency array ensures that the effect runs only once when the component mounts

  const [showFullText, setShowFullText] = useState(false);


  return (
    <section className="post-feed">
      <div className="main-container">
      <AddPost />
      {/* <div className="posts">
        <div className="contents">
          {posts && posts.map((post) => (
            <div className="content">
              <div className="top">
                <div className="client-details">
                  <div className="image" style={post ? {
                    backgroundImage: `url(${post.user.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null} onClick={() => history.push(`/profile/${post.user.id}`)}>

                  </div>
                  <p onClick={() => history.push(`/profile/${post.user.id}`)}>
                    <span className="name">{post.user.username}</span>
                    <span className="date">{new Date(post.date).toLocaleDateString()}</span>
                  </p>
                </div>

                <div className="actions">
                  <BsThreeDots />
                </div>
              </div>
              <div className="post-container">
                <p className={`details ${showFullText ? "show-all" : "limited"}`}>
                  {showFullText ? post.content : truncateWords(post.content, 30)}
                  {post.content.split(' ').length > 30 && (
                    <button
                      className="see-more"
                      style={{ display: 'inline', marginLeft: '5px' }}
                      onClick={() => setShowFullText(!showFullText)}
                    >
                      {showFullText ? "See Less" : "See More"}
                    </button>
                  )}
                </p>
                {post.image && (
                  <div className="post-image" style={post ? {
                    backgroundImage: `url(${post.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null}>

                  </div>
                )}
                <div className="comment">
                  <span><FaRegComment /><p>Comments</p></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      </div>
    </section>
  );
};

export default Posts;
