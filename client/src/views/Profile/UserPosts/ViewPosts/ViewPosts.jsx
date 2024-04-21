import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import './ViewPosts.scss'
import AddPostForm from '../AddPostForm/AddPostForm'

import { BsThreeDots } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import ip from '../../../../ip';
import moment from 'moment'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import useAxios from '../../../../utils/useAxios';
const truncateWords = (text, numWords) => {
  const words = text.split(' ');
  if (numWords >= words.length) {
    return text;
  }
  return words.slice(0, numWords).join(' ') + ' ...';
};


const swal = require('sweetalert2')
function ViewPosts({ posts, user_id, fetchUserPosts }) {
  const accessToken = localStorage.getItem('token')
  const currentUser = JSON.parse(sessionStorage.getItem('loggedInUser'))
  const history = useHistory()
  const axios = useAxios()

  const [viewPostForm, setViewPostForm] = useState(false)
  const [showFullText, setShowFullText] = useState(false);



  const handleDelete = async (postId) => {
    swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = accessToken;

          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          await axios.delete(`${ip}/forum/posts/${postId}/delete/`, config).then((response) => {
            console.log(response)
            if (response.data.success) {
              swal.fire({
                title: "Post deleted.",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
              })
              fetchUserPosts()
            }
          });

        } catch (error) {
          console.error('Error deleting post:', error);
        }
      }
    });
  };
  return (
    <section className="posts-container">
      {currentUser.id == user_id && (viewPostForm && (<AddPostForm viewPostForm={viewPostForm} setViewPostForm={setViewPostForm} fetchUserPosts={fetchUserPosts} />))}

      {currentUser.id == user_id &&
        <div className="add-post">
          <div className="top">
            <div className="image" style={currentUser ? {
              backgroundImage: `url(${currentUser.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            } : null} onClick={() => history.push(`/profile/${currentUser.id}`)}>

            </div>

            <button onClick={() => setViewPostForm(!viewPostForm)}>
              Write Your Problem Here...
            </button>
          </div>
        </div>
      }

      <div className="posts">
        <div className="post-contents">
          {posts && posts.map((post) => (
            <div className="post-content">
              <div className="top">
                <div className="client-details">
                  <div className="image" style={post ? {
                    backgroundImage: `url(${ip}${post.user.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null} onClick={() => history.push(`/profile/${post.user.id}`)}>

                  </div>
                  <p onClick={() => history.push(`/profile/${post.user.id}`)}>
                    <span className="name">{post.user.username}</span>
                    {/* <span className="date">{new Date(post.date).toLocaleDateString()}</span> */}
                    <span className="date">{moment.utc(post.date).local().startOf('seconds').fromNow()}</span>
                  </p>
                </div>

                <div className="actions">
                  {currentUser.id == user_id ?
                    <>
                      <FaEdit />
                      <MdDelete onClick={() => handleDelete(post.id)} />
                    </>
                    :
                    <BsThreeDots />
                  }
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
                    backgroundImage: `url(${ip}${post.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  } : null}>

                  </div>
                )}
                <div className="comment">
                  <span onClick={() => history.push(`/user-post-detail/${post.id}`)}><FaRegComment /><p>Comments</p></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ViewPosts